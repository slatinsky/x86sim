import {get} from 'svelte/store';
import {appState} from "./stores";
import {projectName, programs} from "./stores";
import {orderBy} from 'lodash-es'
import {memory, registers, code} from "./stores";

interface Project {
    name: string,
    data: {
        registers: any,
        memory: any,
        code: string
    }
}

// default values for empty project
const defaultProject: Project = {
    name: "__default__",
    data: {
        registers: {},
        memory: {},
        code: ""
    }
}

// creates object from currently loaded project
function getCurrentProject() {
    let currentProject: Project = {
        name: get(projectName),
        data: {
            registers: registers.reduce(),
            memory: memory.reduce(),
            code: get(code)
        }
    }
    return currentProject
}

// replaces currently loaded project from object
function setCurrentProject(projectToLoad: Project) {
    console.log("projectToLoad.data.registers", projectToLoad.data.registers)
    registers.load(projectToLoad.data.registers)
    memory.load(projectToLoad.data.memory)
    code.set(projectToLoad.data.code)
    projectName.set(projectToLoad.name)
}

//  returns program with name 'projectName'
function getProgram(projectName: string) {
    let allPrograms: Project[] = get(programs)
    return allPrograms.filter(program => program.name === projectName)?.[0]
}

// returns true if program with name 'projectName' exists
function projectExist(projectName: string) {
    if (getProgram(projectName)) {
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
    let currentProject = getCurrentProject()
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
    if (projectExist(projectName)) {
        // save current project
        saveCurrentProject()

        // load new program
        setCurrentProject(getProgram(projectName))

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
    if (!projectExist(projectName)) {
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


// clears current project and creates new blank project
// function clearCurrentProject() {
//     // clear current variables
//     ax.set(0)
//     bx.set(0)
//     cx.set(0)
//     dx.set(0)
//     si.set(0)
//     di.set(0)
//     bp.set(2000)
//     sp.set(2000)
//     code.set("")
//
//     let counter = 1
//     while (true) {
//         console.log('counter', counter)
//         if (!projectExist("Nový projekt " + counter)) {
//             projectName.set("Nový projekt " + counter)
//             saveProgram()
//             return
//         }
//         counter++
//     }
// }

export function deleteProject(projectNameToDelete) {
    // get all programs from localstorage
    let allProjects: Project[] = get(programs)

    // remove current program from the object - current program will be added in the next step
    let allProjectsWithoutCurrentOne = allProjects.filter(project => project.name !== projectNameToDelete)

    // apply changes
    programs.set(allProjectsWithoutCurrentOne)

    // if currently deleted project is currently loaded one, replace loaded project with default one
    if (projectNameToDelete === get(projectName)) {  // if we are deleting currently opened program
        setCurrentProject(defaultProject)
    }
}




