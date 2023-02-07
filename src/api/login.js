import request from '../http/request';


export function loginApi(username,password) {
    return request({
        url:'/employee/login',
        method:'post',
        data:{
            username:username,
            password:password
        }
    })
}

export function logoutApi(){
    return request({
        url: '/employee/logout',
        method: 'post',
    })
}
export function deleteCategory(id) {
    return request({
        url:'/category/deletecategory',
        method:'post',
        data:{
            id:id
        }
    })
}



// export function login(username,password){
//     return request({
//         url:'/login',
//         method:'post',
//         data:{
//             username:username,
//             password:password
//         }
//     });
// }
export function checkToken(){
    return request({
        url:'/employee/loginbytoken',
        method:'post',
        data:{
        }
    });
}
// export function loginOut(){
//     return request({
//         url:'/login/logout',
//         method:'get',
//         params:{
//         }
//     });
// }
// export function pageList(pageNum,pageSize){
//     return request({
//         url:'/employee/page',
//         method:'get',
//         params:{
//             pageNum:pageNum,
//             pageSize:pageSize
//         }
//     });
// }
export function updataforuser(id,username,name,sex,idNumber,phone){
    return request({
        url:'/employee/updataforuser',
        method:'post',
        data:{
            id:String(id),
            username:String(username),
            name:String(name),
            sex:String(sex),
            idNumber:String(idNumber),
            phone:String(phone)
        }
    });
}
// export function getAllCourseInfo(z,banji){
//     return request({
//         url:'/course/courseinfo',
//         method:'post',
//         data:{
//             banji:banji,
//             z:z,//周
//         }
//     });
// }
// export function getAllStudentCourseInfo(z,id){
//     return request({
//         url:'/course/student/courseinfo',
//         method:'post',
//         data:{
//             z:z,
//             id:id,//周
//         }
//     });
// }
//
export function getStoreList(pageNum,pageSize,name){
    return request({
        url:'/store/get',
        method:'get',
        params:{
            pageNum:pageNum,
            pageSize:pageSize,
            name:name
        }
    });
}

export function getMemberList(pageNum,pageSize,name){
    return request({
        url:'/employee/get',
        method:'get',
        params:{
            pageNum:pageNum,
            pageSize:pageSize,
            name:name
        }
    });
}

export function getFoodList(pageNum,pageSize,storeId,name){
    return request({
        url:'/dish/get',
        method:'get',
        params:{
            pageNum:pageNum,
            pageSize:pageSize,
            storeId:storeId,
            name:name
        }
    });
}
export function queryDishList(categoryId,storeId,name){
    return request({
        url:'/dish/get/listbycategory',
        method:'get',
        params:{
            categoryId:categoryId==undefined?undefined:categoryId,
            storeId:storeId,
            name:name==''?undefined:name
        }
    });
}


export function getSetmealList(pageNum,pageSize,storeId,name){
    return request({
        url:'/setmeal/get',
        method:'get',
        params:{
            pageNum:pageNum,
            pageSize:pageSize,
            storeId:storeId,
            name:name
        }
    });
}

export function dishStatusByStatus(params){
    return request({
        url:'/dish/put',
        method:'put',
        params
    });
}

export function setmealStatusByStatus(params){
    return request({
        url:'/setmeal/put',
        method:'put',
        params
    });
}


export function deleteDish(params){
    return request({
        url:'/dish/del',
        method:'delete',
        params
    });
}

export function deleteSetmeal(params){
    return request({
        url:'/setmeal/del',
        method:'delete',
        params
    });
}

export function getDishFlavor(params){
    return request({
        url:'/dish/get/flavor',
        method:'get',
        params
    });
}
export function getSetmealDish(params){
    return request({
        url:'/setmeal/get/dish',
        method:'get',
        params
    });
}
export function getSetmealFlavor(params){
    return request({
        url:'/setmeal/get/flavor',
        method:'get',
        params
    });
}

export function enableAndDisableStore(userId,storeId,storeStatus){
    return request({
        url:'/store/updatastorestatus',
        method:'post',
        data:{
            userId:userId,
            storeId:storeId,
            storeStatus:storeStatus
        }
    });
}



export function enableAndDisableEmployee(userId,caozuoId,userStatus){
    return request({
        url:'/employee/updataemployeestatus',
        method:'post',
        data:{
            userId:String(userId),
            caozuoId:String(caozuoId),
            userStatus:String(userStatus)
        }
    });
}

//
// export function getStudentAllCourseInfoThisWeek(sid){
//     return request({
//         url:'/course/student/thisweekcourseinfo',
//         method:'get',
//         params:{
//             sid:sid
//         }
//     });
// }
//
export function deleteStore(userId,storeId){
    return request({
        url:'/store/deletestore',
        method:'post',
        data:{
            userId:userId,
            storeId:storeId
        }
    });
}

export function deleteEmployee(userId,caozuoId){
    return request({
        url:'/employee/deleteemployee',
        method:'post',
        data:{
            userId:userId,
            caozuoId:caozuoId
        }
    });
}

//
export function getStoreListOnlyIdWithName(){
    return request({
        url:'/store/getstorelistonlyidwithname',
        method:'get',
        params:{
        }
    });
}
export function getEmployeeListOnlyIdWithName(){
    return request({
        url:'/employee/getemployeelistonlyidwithname',
        method:'get',
        params:{
        }
    });
}

export function addCategory(type,name,sort,storeId){
    return request({
        url:'/category/save',
        method:'post',
        data:{
            type:type,
            name:name,
            sort:sort,
            storeId:storeId
        }
    });
}
export function addSetmeal(data){
    return request({
        url:'/setmeal/add',
        method:'post',
        data:data
    });
}


export function updataCategory(id,type,name,sort){
    return request({
        url:'/category/updata',
        method:'post',
        data:{
            id:id,
            type:type,
            name:name,
            sort:sort
        }
    });
}

export function getCategoryPage(pageNum,pageSize,storeIdvalue){
    return request({
        url:'/category/getcategorypage',
        method:'post',
        data:{
            pageNum:pageNum,
            pageSize:pageSize,
            storeId:storeIdvalue
        }
    });
}
export function getCategoryLableValueList(storeId,type){
    return request({
        url:'/category/getcategorylablevaluelist',
        method:'post',
        data:{
            storeId:storeId,
            type:type
        }
    });
}


export function addDish(name,categoryId,price,image,description,status,sort,storeId,dishFlavorResultList){
    return request({
        url:'/dish/add',
        method:'post',
        data:{
            name:name,
            categoryId:categoryId,
            price:price,
            image:image,
            description:description,
            status:status,
            sort:sort,
            storeId:storeId,
            dishFlavors:dishFlavorResultList
        }
    });
}
// export function addSetMeal(name,categoryId,price,image,description,status,sort,storeId,SetMealResultList){
//     return request({
//         url:'/setmeal/add',
//         method:'post',
//         data:{
//             name:name,
//             categoryId:categoryId,
//             price:price,
//             image:image,
//             description:description,
//             status:status,
//             sort:sort,
//             storeId:storeId,
//             setmealResultList:SetMealResultList
//         }
//     });
// }


export function editSetmeal(data){
    return request({
        url:'/setmeal/edit',
        method:'post',
        data
    });
}

export function editDish(name,categoryId,price,image,description,status,sort,storeId,dishFlavorResultList,id,version){
    return request({
        url:'/dish/edit',
        method:'post',
        data:{
            id:id,
            name:name,
            categoryId:categoryId,
            price:price,
            image:image,
            description:description,
            status:status,
            sort:sort,
            storeId:storeId,
            dishFlavors:dishFlavorResultList,
            version:version,
        }
    });
}

//
// export function getMaxWeek(klassid){
//     return request({
//         url:'/course/courseinfo/maxweek',
//         method:'post',
//         data:{
//             classid:klassid
//         }
//     });
// }
//
// export function getStudentMaxWeek(sid){
//     return request({
//         url:'/course/student/courseinfo/maxweek',
//         method:'post',
//         data:{
//             sid:sid
//         }
//     });
// }
//
// export function getTeacherByCourseId(id){
//     return request({
//         url:'/teacher/getcourseteacher',
//         method:'get',
//         params:{
//             courseId:id,
//         }
//     });
// }
// export function getCascaderList(){
//     return request({
//         url:'/course/getcascaderlist',
//         method:'get',
//         params:{
//         }
//     });
// }
// export function getClassListByTid(tid){
//     return request({
//         url:'course/getclasslistbytid',
//         method:'get',
//         params:{
//             tid:tid
//         }
//     });
// }
//
export function changePassWord(id,username,password,newpassword,checknewpassword){
    return request({
        url:'/employee/changepassword',
        method:'post',
        data:{
            id:String(id),
            username:String(username),
            password:String(password),
            newpassword:String(newpassword),
            checknewpassword:String(checknewpassword)
        }
    });
}
export function addMenDian(userid,mendianname,mendianjianjie,mendianstate){
    return request({
        url:'/store/add',
        method:'post',
        data:{
            userId:String(userid),
            storeName:String(mendianname),
            storeIntroduction:String(mendianjianjie),
            storeStatus:String(mendianstate),
        }
    });
}
export function updataMenDian(userid,mendianid,mendianname,mendianjianjie,mendianstate){
    return request({
        url:'/store/updata',
        method:'post',
        data:{
            userId:String(userid),
            storeId:String(mendianid),
            storeName:String(mendianname),
            storeIntroduction:String(mendianjianjie),
            storeStatus:String(mendianstate),
        }
    });
}

export function addmember(data){//不用传入操作者id了,加在header中了
    return request({
        url:'/employee/add',
        method:'post',
        data:{
            name:String(data.name),
            username:String(data.username),
            phone:String(data.phone),
            idNumber:String(data.idNumber),
            status:String(data.status),
            permissions:data.permissions,
            storeId:data.storeId,
            sex:String(data.sex),
            password:String(data.password),//初始密码
        },
    });
}

export function getStoreById(storeid){//不用传入操作者id了,加在header中了
    return request({
        url:'/store/getstorebyid',
        method:'post',
        data:{
            storeid:String(storeid)
        },
    });
}



export function updataMember(data,userid){
    return request({
        url:'/employee/updataemployee',
        method:'post',
        data:{
            userid:String(userid),
            name:String(data.name),
            username:String(data.username),
            phone:String(data.phone),
            idNumber:String(data.idNumber),
            status:String(data.status),
            permissions:data.permissions,
            storeId:data.storeId,
            sex:String(data.sex)
        },
    });
}