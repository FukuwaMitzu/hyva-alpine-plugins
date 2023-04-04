import terser from '@rollup/plugin-terser';
import {nodeResolve} from '@rollup/plugin-node-resolve';

import {glob} from "glob";

const plugins = [
    nodeResolve(),
    terser({
        maxWorkers: 2
    })
]

function getBuildSettingForPlugins(pluginPaths = []) {
    return pluginPaths.map(pluginPath => {
        return {
            input: pluginPath,
            output: {
                dir: '.build',
                format: 'iife'
            },
            plugins
        }
    });
}

const pluginPath = [];

export default getBuildSettingForPlugins(glob.sync("builds/*.js"));
