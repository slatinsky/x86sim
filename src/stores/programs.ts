import {get, writable} from "svelte/store";
import {appState, breakpoints, code, codeRunner, codeRunnerStatus, currentlyExecutedLine, debugMode, memory, registers, settings} from "./index";
import {createWritableStore} from "./helpers/createWritableStore";
import {ensureObjectHasDefaultValues} from "../helperFunctions";
import {_} from "svelte-i18n";
import defaultProjectsJson, {defaultProjectsName} from "../defaults/defaultProjects";
import JSZip from "jszip";
import FileSaver from 'file-saver';
import {toastQueue} from "@stores/toastQueue";
import {throttle} from "lodash-es";

// TODO: move this to stores.ts
export const projectName = createWritableStore('currentProjectName', 'default')
projectName.useLocalStorage()


interface Project {
    version: number,
    name: string,
    registers: any,
    memory: any,
    code: string,
    breakpoints: number[],
    shownModules: {
        showCalculator: boolean,
        showRegisters: boolean,
        showScreen: boolean,
        showKeyboard: boolean,
        showStack: boolean,
        showMemory: boolean,
        showCodeEditor: boolean
    }
}


export class Programs {
    subscribe: any
    update: any
    setSvelte: any  // original svelte set

    private projectsLocalStorageCopy: string

    private defaultProject = {
        version:1,
        name:"default",
        registers:{"sp": 0x1000,"bp": 0x1000,"ss": 0x1000, "es": 0xb800},
        memory:{},
        code:"",
        breakpoints: [],
        hide: [],
        shownModules: {
            showCalculator: false,
            showRegisters: true,
            showScreen: true,
            showKeyboard: true,
            showStack: true,
            showMemory: true,
            showCodeEditor: true
        }
    }


    private sortProjects(projects) {
        return projects.sort((project1, project2) => project1.name.localeCompare(project2.name))
    }


    /**
     * find project name without collision
     * first tries supplied name. If collision occurs, append number until no colision is found
     * return non-existing name
     */

    private findProjectNameWithoutCollision(newProjectName: string): string {
        let counter = 1
        let newProjectNameSuggestion;
        while (true) {
            if (counter === 1) {
                newProjectNameSuggestion = newProjectName
                if (!this.projectNameExists(newProjectNameSuggestion)) {
                    break
                }
            }
            else {
                newProjectNameSuggestion = newProjectName + " " + counter
                if (!this.projectNameExists(newProjectNameSuggestion)) {
                    break
                }
            }
            counter++
        }

        return newProjectNameSuggestion
    }

    private loadTutorialProjects(projectsLocalStorageCopy: any) {
        console.log("First load, loading default projects")
        projectsLocalStorageCopy = this.sortProjects(defaultProjectsJson)
        localStorage.setItem("projects", JSON.stringify(defaultProjectsJson))
        projectName.set(defaultProjectsName)

        // show help in first run
        setTimeout(()=>{
            appState.update(state => {
                state.helpShown = true
                return state
            })
        }, 1000)

        return projectsLocalStorageCopy
    }

    /**
     * Loads projects from localstorage
     * if no projects saved in localStorage, calls loadTutorialProjects() to load in tutorial projects
     */
    private loadProjectsFromLocalstorage() {
        // get saved projects from localStorage
        let projectsLocalStorageCopy = JSON.parse(localStorage.getItem('projects'))
        if (projectsLocalStorageCopy === null) { // if first load
            projectsLocalStorageCopy = this.loadTutorialProjects(projectsLocalStorageCopy)
        }
        return projectsLocalStorageCopy
    }

    /**
     * preparation for the future in case of file format change
     */
    private upgradeProjectVersion(project: Project): Project {
        if (project.version === 1) {
            // project.version = 2
            // .. upgrade project object here
        }
        ensureObjectHasDefaultValues(project, this.defaultProject)
        return project
    }

    /**
     * if projects were updated in another tab, they have written to localStorage - to keep in sync, load updated data in this tab too
     * check for updated data every 100 milliseconds
     * only non focused tab is updated, because only currently focused tab is modifying data created by user
     */
    private synchronizeProjects() {
        if (!document.hasFocus()) {
            let projectsFromLocalStorage = localStorage.getItem('projects')
            if (this.projectsLocalStorageCopy !== projectsFromLocalStorage) {
                console.log("Projects changed in another tab, reloading")
                this.setSvelte(JSON.parse(projectsFromLocalStorage))
                console.log("projectsFromLocalStorage", JSON.stringify(projectsFromLocalStorage))
                if (get(projectName)) {
                    console.warn("projectName", get(projectName))
                    this.loadProject(get(projectName))
                }
            }
        }
    }

    constructor() {
        console.log("PROJECTS CREATED")

        // load from localStorage
        this.projectsLocalStorageCopy = this.loadProjectsFromLocalstorage()

        // create svelte store
        const {subscribe, set, update} = writable(this.projectsLocalStorageCopy);
        this.setSvelte = set
        this.subscribe = subscribe
        this.update = update

        // subscribe for changes and save changes in localStorage
        const unsubscribe = this.subscribe(updatedValue => {
            this.projectsLocalStorageCopy = JSON.stringify(updatedValue)
            localStorage.setItem('projects', this.projectsLocalStorageCopy)
        });

        setInterval(()=> {
            this.synchronizeProjects()
        }, 100)



        // load autosaved project
        this.loadCurrentProject()



        // autosave currently opened project
        const throttledSaveCurrentProject = throttle(this.saveCurrentProject.bind(this), 1000);  // 1 sec throttle
        code.subscribe(updatedCode => {
            throttledSaveCurrentProject()
        });
        registers.subscribe(_ => {
            throttledSaveCurrentProject()
        });
        memory.subscribe(_ => {
            throttledSaveCurrentProject()
        });
        breakpoints.subscribe(_ => {
            throttledSaveCurrentProject()
        });
    }

    saveCurrentProject() {
        if (!get(debugMode)) {
            this.update(projects => {
                let projectToSave = {
                    version: 1,
                    name: get(projectName),
                    registers: registers.reduce(),
                    memory: memory.reduce(),
                    code: get(code),
                    breakpoints: breakpoints.reduce(),
                    shownModules: get(settings).shownModules
                }

                //Find index of specific object using findIndex method.
                let projectIndex = projects.findIndex((project => project.name == get(projectName)));  // single brackets mutate array - https://stackoverflow.com/a/41938641/14409632

                if (projectIndex === -1) {  // project name not yet in array
                    projects = [...projects, projectToSave]
                }
                else {
                    projects = [...projects.slice(0, projectIndex), projectToSave, ...projects.slice(projectIndex + 1)]
                }
                return projects
            })
        }
    }
    getCurrentProject() {
        let projects:any[] = get(this)
        return projects.filter(project => project.name === get(projectName))
    }
    getAllProjects() {
        return get(this)
    }
    set(projectName: string, arg2) {

    }
    loadProject(projectNameToLoad: string) {
        codeRunner.reset()  // reset currently loaded project and free up history, so new one can be loaded safely
        codeRunnerStatus.set('loading-project')
        let projects:any[] = get(this)
        let projectToLoad = projects.filter(project => project.name === projectNameToLoad)?.[0]
        if (!projectToLoad) {
            projectToLoad = JSON.parse(JSON.stringify(this.defaultProject))
        }
        projectToLoad = this.upgradeProjectVersion(projectToLoad)
        projectName.set(projectToLoad.name)
        registers.load(projectToLoad.registers)
        memory.load(projectToLoad.memory)
        code.set(projectToLoad.code)
        breakpoints.load(projectToLoad.breakpoints)
        document.title = `${projectToLoad.name} | x86sim`

        settings.update(currentSettings => {
            currentSettings.shownModules = projectToLoad.shownModules ?? this.defaultProject.shownModules
            return currentSettings
        })

        if (get(currentlyExecutedLine) !== -1) {
            codeRunnerStatus.set('reset')
        }
        else {
            codeRunnerStatus.set('not-runnable')
        }
    }
    renameProject(oldProjectName: string, newProjectName: string) {
        if (oldProjectName !== newProjectName) {
            this.update(projects => {
                newProjectName = this.findProjectNameWithoutCollision(newProjectName)

                projects.map(project => {
                    if (project.name === oldProjectName) {
                        project.name = newProjectName
                    }
                    return project
                })

                if (get(projectName) === oldProjectName) {  // if the renamed project is currently loaded - reload it
                    this.loadProject(newProjectName)
                }
                return this.sortProjects(projects)
            })
        }
    }
    deleteProject(projectNameToDelete: string) {
        this.update(projects => {
            if (get(projectName) === projectNameToDelete) {
                if (projects.length <= 1) {
                    projects = [JSON.parse(JSON.stringify(this.defaultProject))]
                    this.loadProject(this.defaultProject.name)
                }
                else {
                    projects = projects.filter(project => project.name !== projectNameToDelete)
                    this.loadProject(projects[0].name) //switch to different project
                }
            }
            else {
                projects = projects.filter(project => project.name !== projectNameToDelete)
            }
            return projects
        })
        console.log("deleteProject dummy", projectNameToDelete)
    }
    projectNameExists(projectName: string) {
        return (<any[]>get(this)).filter(project => project.name === projectName).length !== 0
    }
    newProject(newProjectName: string): string {  // returns created project name
        console.log("newProject dummy", newProjectName)
        this.update(projects => {
            newProjectName = this.findProjectNameWithoutCollision(newProjectName)
            let newProject = JSON.parse(JSON.stringify(this.defaultProject))
            newProject.name = newProjectName
            return this.sortProjects([...projects, newProject])
        })
        return newProjectName  // may be different than supplied name if collision
    }
    loadCurrentProject() {
        this.loadProject(get(projectName))
    }
    downloadProject(projectName: string) {
        // modified https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
        let filename = projectName + ".json"
        let fileContent = JSON.stringify((<any[0]>get(this)).filter(project => project.name === projectName)[0], null, 2)
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    downloadAllProjects(projectName: string) {
        let zip = new JSZip();
        (<any[]>get(this)).map(project => {
            let filename = project.name + ".json"
            let fileContent = JSON.stringify(project, null, 2)  // prettify
            zip.file(filename, fileContent);
        })

        zip.generateAsync({type: "blob"}).then(function(content) {
            FileSaver.saveAs(content, (new Date()).toISOString() + " x86sim.zip");
        });
    }
    uploadProject(jsonContent: string, file, isLast:boolean=false) {
        let _this = this
        this.update(projects => {
            let newProject
            try {
                newProject = JSON.parse(jsonContent)
            }
            catch (e) {
                try {
                    if (file != null) {
                        let jsZip = new JSZip();
                        jsZip.loadAsync(file).then(function (zip) {
                            Object.keys(zip.files).forEach(function (filename) {
                                zip.files[filename].async('string').then(function (fileData) {
                                    _this.uploadProject(fileData, null, false)
                                })
                            })
                        })
                    }
                }
                catch (e) {
                    alert(get(_)('views.projects.prompts.invalidFile'))
                }

                return projects
            }

            // simple validation if uploaded .json was created by this simulator. If not, abort
            if (!(newProject.hasOwnProperty('version') && newProject.hasOwnProperty('name') && newProject.hasOwnProperty('registers') && newProject.hasOwnProperty('memory') && newProject.hasOwnProperty('code'))) {
                toastQueue.error(get(_)('views.projects.prompts.invalidJson'))
                return projects
            }


            // Project we are trying to upload exists? Ask if we should overwrite it

            if (projects.filter(project => project.name === newProject.name).length !== 0) {
                let collisionProject = projects.filter(project => project.name === newProject.name)[0]

                let areProjectsTheSame = JSON.stringify(collisionProject, null, 2) === JSON.stringify(newProject, null, 2)
                if (areProjectsTheSame) {
                    // no change, projects are the same

                    // but load it
                    if (isLast) {  // we need to load only last dropped project
                        setTimeout(()=>this.loadProject(newProject.name), 0)  // delay the loading, project doesn't exist now yet
                    }
                    return projects
                }
                else if (confirm(get(_)('views.projects.prompts.projectsNotTheSame', {values: {programName: newProject.name}}))) {
                    projects = projects.filter(project => project.name !== newProject.name)  // remove old project before adding new one
                } else {
                    // user has pressed 'cancel'
                    toastQueue.error(get(_)('views.projects.toasts.importCanceled', {values: {programName: newProject.name}}))
                    return projects
                }
            }

            // "upload" the project
            if (isLast) {  // we need to load only last dropped project
                setTimeout(()=>this.loadProject(newProject.name), 0)  // delay the loading, project doesn't exist now yet
            }
            toastQueue.success(get(_)('views.projects.toasts.imported', {values: {programName: newProject.name}}))
            return this.sortProjects([...projects, newProject])
        })
    }
    deleteAllProjects() {
        this.setSvelte([JSON.parse(JSON.stringify(this.defaultProject))])
        this.loadProject(this.defaultProject.name)
        toastQueue.success(get(_)('views.projects.toasts.allDeleted'))
    }
}

