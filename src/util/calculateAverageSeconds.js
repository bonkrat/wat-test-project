import { mean } from "lodash";
import getSeconds from "./getSeconds";

const calculateAverageSeconds = timings => getSeconds(mean(timings));

export default calculateAverageSeconds;
