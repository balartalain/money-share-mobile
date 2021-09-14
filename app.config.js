export default ({ config }) => {
    return {
        ...config,
        extra:{
            env: process.env.ENV || 'PRODUCTION',
            offline: process.env.OFFLINE || false
        }
    }
}
