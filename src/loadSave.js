import { get } from 'svelte/store';
import {selectedFormat, ax, bx, cx, dx, si, di, bp, sp, programs} from "./registersStore";

function getProgram(programName) {
    let allPrograms = get(programs)
    return allPrograms.filter(program => program.name === programName)?.[0]?.data
}

function saveToAllPrograms(currentProgram) {
    // get all programs from localstorage
    let allPrograms = get(programs)

    // remove current program from the object - current program will be added in the next step
    let allProgramsWithoutCurrentOne = allPrograms.filter(program => program.name !== currentProgram.name)


    allPrograms = [currentProgram, ...allProgramsWithoutCurrentOne]
    programs.set(allPrograms)
}

// export function newProgram() {
//
// }

export function deleteProgram(programName) {
    // get all programs from localstorage
    let allPrograms = get(programs)

    // remove current program from the object - current program will be added in the next step
    let allProgramsWithoutCurrentOne = allPrograms.filter(program => program.name !== programName)

    if (programs.length > 0) {
        loadProgram(programs[0].name)
    }

    programs.set(allProgramsWithoutCurrentOne)
}

export function saveProgram(programName) {
    if (!programName) {
        alert(`programName is required`)
        return
    }
    let currentProgram = {
        name: programName,
        data: {
            ax: get(ax),
            bx: get(bx),
            cx: get(cx),
            dx: get(dx),
            si: get(si),
            di: get(di),
            bp: get(bp),
            sp: get(sp)
        }
    }

    console.log('saveToFile', currentProgram)
    console.log('getAllPrograms', get(programs))
    saveToAllPrograms(currentProgram)
}

export function loadProgram(programName) {
    let program = getProgram(programName)

    if (program) {
        ax.set(program.ax)
        bx.set(program.bx)
        cx.set(program.cx)
        dx.set(program.dx)
        si.set(program.si)
        di.set(program.di)
        bp.set(program.bp)
        sp.set(program.sp)
    }
    else {
        alert(`Program with name ${program} doesn't exist`)
    }

}
