const groups = {
    1124536:{
        user1: true,
        user2: false, // is admin
        user3: true
    }
}
const users = {
  balartalain:{
    group: 1124536,
    expense:{
      2021:{
        
      }
    }
  }
}
// const user_years = {
//   balartalain:{
//     2021: true,
//     2020: true
//   }
// }
const user_months_amount={
  balartalain:{
    2021:{
      1: 10000,
      2: 2000
    },
    2020: {
      1: 10000,
      2: 2000
    },
    2019:{
      1: 10000,
      2: 2000
    },
  }
}
const data = {
  balartalain:{
    "2021":
      {
        "1":{
          "13":{
            "0530":{
              "category": "Venta de Zapatos",
              "comment": "Algún comentario",
              "amount": 10000,
              "currency": "CUP"          
            }
          },
          "11":{
            "0540":{
              "category": "Venta de Zapatos",
              "comment": "Algún comentario",
              "amount": 10000,
              "currency": "CUP"          
            },
            "1200":{
              "category": "Compra de Dolares",
              "comment": "Algún comentario",
              "amount": -8000,
              "currency": "CUP"        
            }
          }
        },
        "2":{
          "1":{
            "0330":{
              "category": "Venta de Zapatos",
              "comment": "Algún comentario",
              "amount": 10000,
              "currency": "CUP"          
            },
            "0410":{
              "category": "Compra de Dolares",
              "comment": "Algún comentario",
              "amount": -8000,
              "currency": "CUP"        
            },
            "0540":{
              "category": "Venta de Zapatos",
              "comment": "Algún comentario",
              "amount": 10000,
              "currency": "CUP"          
            },
            "1200":{
              "category": "Compra de Dolares",
              "comment": "Algún comentario",
              "amount": -8000,
              "currency": "CUP"        
            }
          },
          "2":{
            "0330":{
              "category": "Venta de Zapatos",
              "comment": "Algún comentario",
              "amount": 10000,
              "currency": "CUP"          
            },
            "0410":{
              "category": "Compra de Dolares",
              "comment": "Algún comentario",
              "amount": -8000,
              "currency": "CUP"        
            },
            "0540":{
              "category": "Venta de Zapatos",
              "comment": "Algún comentario",
              "amount": 10000,
              "currency": "CUP"          
            },
            "1200":{
              "category": "Compra de Dolares",
              "comment": "Algún comentario",
              "amount": -8000,
              "currency": "CUP"        
            }
          },
          "3":{
            "0330":{
              "category": "Venta de Zapatos",
              "comment": "Algún comentario",
              "amount": 10000,
              "currency": "CUP"          
            },
            "0410":{
              "category": "Compra de Dolares",
              "comment": "Algún comentario",
              "amount": -8000,
              "currency": "CUP"        
            },
            "0540":{
              "category": "Venta de Zapatos",
              "comment": "Algún comentario",
              "amount": 10000,
              "currency": "CUP"          
            },
            "1200":{
              "category": "Compra de Dolares",
              "comment": "Algún comentario",
              "amount": -8000,
              "currency": "CUP"        
            }
          }
        }
    },
    2020:{
      "1":{
        "13":{
          "0530":{
            "category": "Venta de Zapatos",
            "comment": "Algún comentario",
            "amount": 10000,
            "currency": "CUP"          
          }
        }
      }
    }
  }
}
  export {
    groups,
    users,
    user_months_amount,
    data
  }