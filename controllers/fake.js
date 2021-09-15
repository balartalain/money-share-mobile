const awaitAsync = async(delay)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, delay)
    })
}

const Heroku = {
    registerUser : async (userInfo)=>{           
        let response = await herokuAPI.put(`/${userInfo.id}/register-user?env=${ENV}`, userInfo)
        return response
    },
    getUsers: async ()=>{
        await awaitAsync(2000)
        return Promise.resolve({data:{
            '10222108852244678' : {
                'email' : 'balartalain@gmail.com',
                'name' : 'Alain Pérez Balart',
                'supervisor' : 'true'
            },
            '1103254433491655' : {
                'email' : 'yosnaudisruiz.27@gmail.com',
                'name' : 'Yosnaudi Palacio',
                'supervisor' : 'true'
            },
            '2940877732852439' : {
                'email' : 'henryscot1508@gmail.com',
                'name' : 'Henry Scott',
                'supervisor' : 'true'
            },
            '2948407892063044' : {
                'email' : 'alexanderalvarezgarcia@gmail.com',
                'name' : 'Alexander Alvarez Garcia'
            },
            '2971535899839548' : {
                'email' : 'katia@cphem.scu.sld.cu',
                'name' : 'Katia Miranda'
            },
            '948120105732712' : {
                'email' : 'sylenaid2907@gmail.com',
                'name' : 'Dianellys Rodriguez Arcia',
                'supervisor' : 'false'
            },
            '2948407892063041' : {
                'email' : 'alexanderalvarezgarcia@gmail.com',
                'name' : 'Alexander Alvarez Garcia'
            },
            '2971535899839542' : {
                'email' : 'katia@cphem.scu.sld.cu',
                'name' : 'Katia Miranda'
            },
            '948120105732713' : {
                'email' : 'sylenaid2907@gmail.com',
                'name' : 'Dianellys Rodriguez Arcia',
                'supervisor' : 'false'
            }
        }})
    },
    getUserData : async (userId)=>{  
        await awaitAsync(2000)        
        return Promise.resolve({ data:{
            '2021' : {
                '9' : {
                    '02' : {
                        '1633147200000' : {
                            'amount' : 2,
                            'comment' : '10',
                            'concept' : ' Agosto Me dio Henry para pago de remesas',
                            'currency' : 'CUP',
                            'updated' : 1625233340980
                        },
                        '1630555200000' : {
                            'amount' : 1,
                            'comment' : '09',
                            'concept' : 'Pago de 300 CUP puesto en la cuenga de Dairon',
                            'currency' : 'CUP',
                            'updated' : 1625233614348
                        },
                        '1635825600000' : {
                            'amount' : 3,
                            'comment' : '11',
                            'concept' : 'Otr',
                            'currency' : 'USD',
                            'updated' : 1625233614348
                        }
                    }
                }, '6' : {
                    '02' : {
                        '1625233340980' : {
                            'amount' : 5,
                            'comment' : '',
                            'concept' : ' Junio 2021 Me dio Henry para pago de remesas',
                            'currency' : 'CUP',
                            'updated' : 1625233340980
                        },
                        '1625233614348' : {
                            'amount' : 5,
                            'comment' : '',
                            'concept' : 'Pago de 300 CUP puesto en la cuenga de Dairon',
                            'currency' : 'CUP',
                            'updated' : 1625233614348
                        },
                        '1625233614349' : {
                            'amount' : 5,
                            'comment' : '',
                            'concept' : 'Otr',
                            'currency' : 'USD',
                            'updated' : 1625233614348
                        }
                    }
                }
            }, '2020' : {
                '6' : {
                    '01' : {
                        '1625233340980' : {
                            'amount' : 5,
                            'comment' : '',
                            'concept' : 'Junio  2020 Me dio Henry para pago de remesas',
                            'currency' : 'CUP',
                            'updated' : 1625233340980
                        }
                    },
                    '02':{
                        '1625233614348' : {
                            'amount' : 5,
                            'comment' : '',
                            'concept' : 'Pago de 300 CUP puesto en la cuenga de Dairon',
                            'currency' : 'CUP',
                            'updated' : 1625233614348
                        }
                    }
                }
            }
        }
        })
    },
    createExpense: async(userId, data)=>{  
        return data
        let response = await herokuAPI.put(`/${userId}/add-expense?env=${ENV}`, data)
        return response     
    },
    deleteExpense: async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }     
        return 1   
        let response = await herokuAPI.put(`/${userId}/delete-expense?env=${ENV}`, data)
        return response     
    },
    setSupervisor: async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
        return 1
        let response = await herokuAPI.put(`/${userId}/set-supervisor?env=${ENV}`, data)
        return response     
    }
}
export default Heroku