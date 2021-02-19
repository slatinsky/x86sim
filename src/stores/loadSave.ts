import {get} from 'svelte/store';
import {appState, code, memory, programs, projectName, registers} from "./stores";
import {orderBy} from 'lodash-es'

interface Project {
    version: int,
    name: string,
    registers: any,
    memory: any,
    code: string
}

// default values for empty project
const defaultProject: Project = {
    version: 1,
    name: "__default__",
    registers: {},
    memory: {},
    code: ""
}



//  returns program with name 'projectName'
function getJsonByProjectName(projectName: string) {
    let allPrograms: Project[] = get(programs)
    return allPrograms.filter(program => program.name === projectName)?.[0]
}

// returns true if program with name 'projectName' exists
function projectNameExist(projectName: string) {
    if (getJsonByProjectName(projectName)) {
        return true
    } else {
        return false
    }
}


// saves the project passed in
// if 'currentProject.name' exists in project list, that project will be overwritten
function saveProject(currentProject: Project): void {
    // get all programs from localstorage
    let allProjects: Project[] = get(programs)

    // remove current program from the array - current program will be added in the next step
    let allProjectsWithoutCurrentOne = allProjects.filter(project => project.name !== currentProject.name)

    // merge programs together, sort them by name and save them to store
    allProjects = [currentProject, ...allProjectsWithoutCurrentOne]
    allProjects = orderBy(allProjects, project => project.name)
    programs.set(allProjects)
}


// returns true if successfully saved
export function saveCurrentProject(): boolean {
    let currentProject = loadedProjectToJson()
    if (currentProject.name) {
        saveProject(currentProject)
        return true
    }
    else {
        alert(`projectName is required`)
        return false
    }
}

// loads project with projectName
// returns true if project was loaded
export function loadProject(projectName: string, hideModal: boolean = true): boolean {
    if (projectNameExist(projectName)) {
        // save current project
        saveCurrentProject()

        // load new program
        jsonToLoadedProject(getJsonByProjectName(projectName))

        // hide modal if shown
        if (hideModal) {
            appState.set('projectsShown', false)
        }
        return true
    } else {
        alert(`Project with name ${projectName} doesn't exist`)
        return false
    }

}

// creates new project named as 'projectName'
export function newProject(projectName): boolean {
    // create new project only if it doesn't exist
    if (!projectNameExist(projectName)) {
        // deep copy default project
        let currentEmptyProject = Object.assign({}, defaultProject);
        currentEmptyProject.name = projectName

        // save the project
        saveProject(currentEmptyProject)

        // and load it
        loadProject(projectName)
        return true
    } else {
        return false
    }
}


export function deleteProject(projectNameToDelete) {
    // get all programs from localstorage
    let allProjects: Project[] = get(programs)

    // remove current program from the object - current program will be added in the next step
    let allProjectsWithoutCurrentOne = allProjects.filter(project => project.name !== projectNameToDelete)

    // apply changes
    programs.set(allProjectsWithoutCurrentOne)

    // if currently deleted project is currently loaded one, replace loaded project with default one
    if (projectNameToDelete === get(projectName)) {  // if we are deleting currently opened program
        jsonToLoadedProject(defaultProject)
    }
}






function upgradeProjectVersion(project: Project): Project {
    // reserved for future in case of file format change
    if (project.version !== 1) {
        alert('Incompatible version, only version 1 is supported')
    }
    return project
}

// replaces currently loaded project from object
function jsonToLoadedProject(projectToLoad: Project): void {
    projectToLoad = upgradeProjectVersion(projectToLoad)
    projectName.set(projectToLoad.name)
    registers.load(projectToLoad.registers)
    memory.load(projectToLoad.memory)
    code.set(projectToLoad.code)
}

// creates object from currently loaded project
function loadedProjectToJson(): Project {
    return {
        version: 1,
        name: get(projectName),
        registers: registers.reduce(),
        memory: memory.reduce(),
        code: get(code)
    }
}

export function loadAutosaveAndStartAutosaving() {
    // load autosaved project first
    if (localStorage.getItem('autosave') !== null) {
        let projectToLoad = JSON.parse(localStorage.getItem('autosave'))
        jsonToLoadedProject(projectToLoad)
    }

    // then start autosaving
    setInterval(()=> {
        let currentProject = loadedProjectToJson()
        localStorage.setItem('autosave', JSON.stringify(currentProject))
    }, 2000)
}
