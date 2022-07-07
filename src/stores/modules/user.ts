import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export default class User {
    // 权限菜单数据
    authorities = [];
    // 打开的tab菜单
    openTabMenus = new Map();
    // keyPathMap 菜单key=》keypath
    keyPathMap = new Map();
    // 激活的菜单
    activeMenu = '';

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: 'user',
            properties: ['authorities','openTabMenus',"activeMenu","keyPathMap"],
            storage: window.localStorage,
        });
    }

    setAuthorities(authorities: any) {
        this.authorities = authorities;
    }

    getAuthorities(){
        return this.authorities;
    }

    addTabMenu(key,value){
        this.openTabMenus.set(key,value)
    }

    removeTabMenu(key){
        this.openTabMenus.delete(key);
    }

    closeAllTabs(){
        this.openTabMenus.clear();
        this.keyPathMap.clear();
        this.setActiveMenu('-1');// 激活首页
    }

    closeOtherTab(){
        this.openTabMenus.forEach((value,key,map)=>{
            if(key!=this.activeMenu){
                this.openTabMenus.delete(key)
            }
        })
        this.keyPathMap.forEach((value,key,map)=>{
            if(key!=this.activeMenu){
                this.keyPathMap.delete(key)
            }
        })
    }
    closeTabByDirection(dict:'left'|'right'){
        this._removeMapByDirection(this.openTabMenus,this.activeMenu,dict);
        this._removeMapByDirection(this.keyPathMap,this.activeMenu,dict);
    }

    _removeMapByDirection(target:Map<any,any>, conditionKey: any, direction: 'left'|'right'){
        let matchActiveMenu = false;
        const leftMenuMap = new Map();
        const rightMenuMap = new Map();
        target.forEach((value,key,map)=>{
            if (key==conditionKey){
                matchActiveMenu = true;
            }
            if(direction=="right"&&matchActiveMenu&&key!=conditionKey){
                target.delete(key)
            }else if(direction=="left"&&!matchActiveMenu){
                target.delete(key)
            }
        })
        return {
            left: leftMenuMap,
            right: rightMenuMap,
        }
    }


    setActiveMenu(menu: string){
        this.activeMenu = menu;
    }
    setKeyPathMap(key,value){
        this.keyPathMap.set(key,value);
    }
    removeKeyPathMap(key){
        this.keyPathMap.delete(key);
    }

}
