// do nothing
import {registers} from "../../stores/registers";

export default  {
    writesTo: [],
    run: () => {
        registers.inc('ip')
    },
}
