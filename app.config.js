export default ({ config }) => {
    return {
        ...config,
        extra:{
            env: process.env.ENV
        }
    }
}
