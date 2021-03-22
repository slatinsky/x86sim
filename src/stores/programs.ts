import {get, writable} from "svelte/store";
import {code, debugMode, memory, registers} from "./stores";
import {createWritableStore} from "./createWritableStore";
import {ensureObjectHasDefaultValues} from "../helperFunctions";

export const projectName = createWritableStore('currentProjectName', 'default')
projectName.useLocalStorage()

function createProjects() {
    interface Project {
        version: number,
        name: string,
        registers: any,
        memory: any,
        code: string
    }

    const defaultProject = {
        "version":1,
        "name":"default",
        "registers":{"sp":32,"bp":32},
        "memory":{},
        "code":"inc ax\r\ninc bx\r\ninc cx\r\nmov ax, ax\r\n\r\n\r\nnavestie2:\r\n    inc ax\r\n    jmp navestie3\r\n\r\nnavestie1:\r\n    push bx\r\n    mov bx, 10\r\n    mov [bx-5], ax\r\n    dec bx\r\n    pop bx\r\n    jmp pushAndPopall\r\n\r\nnavestie3:\r\n    inc dx  ;toto je komentar\r\n    dec bx\r\n    jmp navestie1\r\n     \r\npushAndPopall:\r\n    ; save registers to stack\r\n    push ax\r\n    push bx\r\n    push cx\r\n    push dx\r\n    \r\n    ; restore registers from stack\r\n    pop dx\r\n    pop cx\r\n    pop bx\r\n    pop ax\r\n    jmp navestie2\r\n    \r\n    xor ax, ax\r\n"
    }

    // get saved projects from localStorage

    console.log("currentProjectName", get(projectName))
    let savedPermanentData = JSON.parse(localStorage.getItem('projects'))
    if (savedPermanentData === null) {
        savedPermanentData = [{...defaultProject}]
    }

    // create svelte store
    const {subscribe, set, update} = writable(savedPermanentData);

    function upgradeProjectVersion(project: Project): Project {
        // reserved for future in case of file format change
        if (project.version !== 1) {
            console.log(project)
            alert('Incompatible version, only version 1 is supported')
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
                        code: get(code)
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
                    return projects
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
                    return [...projects, newProject]
                }
                else {
                    return projects
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

                // Add project only if that project doesn't exist yet
                if (projects.filter(project => project.name === newProject.name).length === 0) {

                    if (isLast) {  // we need to load only last dropped project, because autosave may glitch out and overwrite wrong project
                        setTimeout(()=>thisStore.loadProject(newProject.name), 0)  // delay the loading, project doesn't exist now yet
                    }
                    return [...projects, newProject]
                }
                else {
                    alert(`Nahratie projektu '${newProject.name}' neúspešné. Projekt s takýmto názvom už existuje`)
                    return projects
                }
            })
        }
        // reset: () => set([{...defaultProject}]),
    }

    // subscribe for changes and save changes in localStorage
    const unsubscribe = thisStore.subscribe(updatedValue => {
        localStorage.setItem('projects', JSON.stringify(updatedValue))
    });

    return thisStore
}
export const programs = createProjects();
