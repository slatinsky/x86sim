import {get, writable} from "svelte/store";
import {code, debugMode, memory, registers} from "./stores";
import {createWritableStore} from "./createWritableStore";

function createProjectName() {
    const {subscribe, set, update} = writable(savedPermanentData);

    // extend svelte store
    const thisStore = {
        subscribe,
    }

    return thisStore
}

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

    // function saveRegistersToLocalStorage() {
    //     localStorage.setItem('registers', JSON.stringify(thisStore.reduce()))
    // }

    function upgradeProjectVersion(project: Project): Project {
        // reserved for future in case of file format change
        if (project.version !== 1) {
            console.log(project)
            alert('Incompatible version, only version 1 is supported')
        }
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
                    thisStore.loadProject(newProjectName)
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
        // reset: () => set([{...defaultProject}]),
    }

    // subscribe for changes and save changes in localStorage
    const unsubscribe = thisStore.subscribe(updatedValue => {
        localStorage.setItem('projects', JSON.stringify(updatedValue))
    });

    return thisStore
}
export const programs = createProjects();
