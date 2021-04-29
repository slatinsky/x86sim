import {get, writable} from "svelte/store";
import {code, debugMode, memory, registers, settings} from "./stores";
import {createWritableStore} from "./createWritableStore";
import {ensureObjectHasDefaultValues} from "../helperFunctions";
import {codeRunnerStatus} from "../compiler/codeRunner";
import {_} from "svelte-i18n";
import defaultProjectsJson, {defaultProjectsName} from "../defaults/defaultProjects";

export const projectName = createWritableStore('currentProjectName', 'default')
projectName.useLocalStorage()

function createProjects() {
    console.log("PROJECTS CREATED")

    interface Project {
        version: number,
        name: string,
        registers: any,
        memory: any,
        code: string,
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

    let currentProjectHide: string[] = []

    const defaultProject = {
        version:1,
        name:"default",
        registers:{"sp": 0x10000,"bp": 0x10000},
        memory:{},
        code:"",
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

    const sortProjects = (projects) => {
        return projects.sort((project1, project2) => project1.name.localeCompare(project2.name))
    }

    // get saved projects from localStorage

    let savedPermanentData = JSON.parse(localStorage.getItem('projects'))
    if (savedPermanentData === null) {
        // savedPermanentData = [{...defaultProject}]
        console.log("First load, loading default projects")
        savedPermanentData = sortProjects(defaultProjectsJson)
        localStorage.setItem("projects", JSON.stringify(defaultProjectsJson))
        projectName.set(defaultProjectsName)

        setTimeout(()=>{
            alert(get(_)('tutorial.tutorial1'))
        }, 2000)
    }

    // create svelte store
    const {subscribe, set, update} = writable(savedPermanentData);


    function upgradeProjectVersion(project: Project): Project {
        // reserved for future in case of file format change
        if (project.version === 1) {
            // project.version = 2
            // .. upgrade project object here
        }
        ensureObjectHasDefaultValues(project, defaultProject)
        return project
    }


    // extend svelte store
    const thisStore = {
        subscribe,
        saveCurrentProject: () => {
            if (!get(debugMode)) {
                update(projects => {
                    let projectToSave = {
                        version: 1,
                        name: get(projectName),
                        registers: registers.reduce(),
                        memory: memory.reduce(),
                        code: get(code),
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
        },
        getCurrentProject: () => {
            let projects = get(thisStore)
            return projects.filter(project => project.name === get(projectName))
        },
        getAllProjects: () => {
            return get(thisStore)
        },
        set: (projectName: string, arg2) => {

        },
        loadProject: (projectNameToLoad: string) => {
            codeRunnerStatus.set('loading-project')
            let projects = get(thisStore)
            let projectToLoad = projects.filter(project => project.name === projectNameToLoad)?.[0]
            if (!projectToLoad) {
                projectToLoad = {...defaultProject}
            }
            projectToLoad = upgradeProjectVersion(projectToLoad)
            projectName.set(projectToLoad.name)
            registers.load(projectToLoad.registers)
            memory.load(projectToLoad.memory)
            code.set(projectToLoad.code)
            document.title = `${projectToLoad.name} | x86sim`

            settings.update(currentSettings => {
                currentSettings.shownModules = projectToLoad.shownModules ?? defaultProject.shownModules
                return currentSettings
            })
            codeRunnerStatus.set('reset')
        },
        renameProject: (oldProjectName: string, newProjectName: string) => {
            if (oldProjectName !== newProjectName) {
                update(projects => {
                    projects.map(project => {
                        if (project.name === oldProjectName) {
                            project.name = newProjectName
                        }
                        return project
                    })

                    if (get(projectName) === oldProjectName) {  // if the renamed project is currently loaded - reload it
                        thisStore.loadProject(newProjectName)
                    }
                    return sortProjects(projects)
                })
            }
        },
        deleteProject: (projectNameToDelete: string) => {
            update(projects => {
                if (get(projectName) === projectNameToDelete) {
                    if (projects.length <= 1) {
                        projects = [{...defaultProject}]
                        thisStore.loadProject(defaultProject.name)
                    }
                    else {
                        projects = projects.filter(project => project.name !== projectNameToDelete)
                        thisStore.loadProject(projects[0].name) //switch to different project
                    }
                }
                else {
                    projects = projects.filter(project => project.name !== projectNameToDelete)
                }
                return projects
            })
            console.log("deleteProject dummy", projectNameToDelete)
        },
        newProject: (newProjectName: string) => {
            console.log("newProject dummy", newProjectName)
            update(projects => {
                // Add project only if that project doesn't exist yet
                if (projects.filter(project => project.name === newProjectName).length === 0) {
                    let newProject = {...defaultProject}
                    newProject.name = newProjectName
                    return sortProjects([...projects, newProject])
                }
                else {
                    return sortProjects(projects)
                }
            })
        },
        loadCurrentProject: () => {
            thisStore.loadProject(get(projectName))
        },
        downloadProject: (projectName: string) => {
            // modified https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
            let filename = projectName + ".json"
            let fileContent = JSON.stringify(get(thisStore).filter(project => project.name === projectName)[0], null, 2)
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        uploadProject: (jsonContent: string, isLast:boolean=false) => {
            update(projects => {
                let newProject
                try {
                    newProject = JSON.parse(jsonContent)
                }
                catch (e) {
                    alert('Neplatný súbor. Tento súbor neobsahuje platný json formát')
                    return projects
                }

                // simple validation if uploaded .json was created by this simulator. If not, abort
                if (!(newProject.hasOwnProperty('version') && newProject.hasOwnProperty('name') && newProject.hasOwnProperty('registers') && newProject.hasOwnProperty('memory') && newProject.hasOwnProperty('code'))) {
                    alert('Neplatný .json súbor. Nahrávajte prosím iba json súbory vytvorené týmto simulátorom')
                    return projects
                }


                // Project we are trying to upload exists? Ask if we should overwrite it
                if (projects.filter(project => project.name === newProject.name).length !== 0) {
                    if (confirm(`Projekt s menom '${newProject.name}' už existuje? Prepísať ho?`)) {
                        projects = projects.filter(project => project.name !== newProject.name)  // remove old project before adding new one
                    } else {
                        // user has pressed 'cancel'
                        return projects
                    }
                }

                // "upload" the project
                if (isLast) {  // we need to load only last dropped project, because autosave may glitch out and overwrite wrong project
                    setTimeout(()=>thisStore.loadProject(newProject.name), 0)  // delay the loading, project doesn't exist now yet
                }
                return sortProjects([...projects, newProject])
            })
        }
        // reset: () => set([{...defaultProject}]),
    }



    // subscribe for changes and save changes in localStorage
    const unsubscribe = thisStore.subscribe(updatedValue => {
        savedPermanentData = JSON.stringify(updatedValue)
        localStorage.setItem('projects', savedPermanentData)
    });


    // if projects were updated in another tab, they have written to localStorage - to keep in sync, load updated data in this tab too
    // check for updated data every 100 milliseconds
    // only non focused tab is updated, because only currently focused tab is modifying data created by user
    setInterval(()=> {
        if (!document.hasFocus()) {
            let projectsFromLocalStorage = localStorage.getItem('projects')
            if (savedPermanentData !== projectsFromLocalStorage) {
                console.log("Projects changed in another tab, reloading")
                set(JSON.parse(projectsFromLocalStorage))
                console.log("projectsFromLocalStorage", JSON.stringify(projectsFromLocalStorage))
                if (get(projectName)) {
                    console.warn("projectName", get(projectName))
                    thisStore.loadProject(get(projectName))
                }
            }
        }
    }, 100)

    return thisStore
}
export const programs = createProjects();
