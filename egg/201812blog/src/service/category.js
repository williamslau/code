import { get, post, del, put } from './index';
import qs from 'qs';
const ENTITY = '/api/categories';
//查看分类列表 pageNum pageSize keyword
//{pageNum:'',pageSize:'',keyword:""}
function list({ current = 1, pageSize = 5, keyword = '' }) {
    return get(`${ENTITY}?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`);
}
function create(category) { //{name:'分类1'}
    return post(ENTITY, category);
}
function update(category) {
    return put(`${ENTITY}/${category.id}`, category);
}
//两种可能，传过来一个ID字符串，也有可能传过来一个ID字符串数组
function remove(ids) {
    if (typeof ids == 'string') {
        ids = [ids];
    }
    return del(`${ENTITY}/${ids[0]}`, { ids });
}
export default {
    list,
    create,
    update,
    remove
}