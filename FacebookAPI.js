const FacebookAPI = {
    getPictureURL: async function(token, userId){      
        const response = await fetch(`https://graph.facebook.com/${userId}?access_token=${token}&fields=picture`)
        const data = await response.json()
        return data.picture.data.url
    }
}
export default FacebookAPI