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