export const queryCurrentUser = (params)=>{
    return new Promise(resolve => {
        fetch('/api/menu').then(res=>res.json()).then((v)=>{
            resolve(v)
        })
    })
}