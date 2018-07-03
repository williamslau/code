import { get, post, del, put } from './index';
const ENTITY = '/api/articles';
//查看分类列表 pageNum pageSize keyword
//{pageNum:'',pageSize:'',keyword:""}
function list({ current = 1, pageSize = 5, keyword = '' }) {
    return get(`${ENTITY}?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`);
}
function create(item) {
    return post(ENTITY, item);
}
function update(item) {
    return put(`${ENTITY}/${item.id}`, item);
}
//两种可能，传过来一个ID字符串，也有可能传过来一个ID字符串数组
function remove(ids) {
    if (typeof ids == 'string') {
        ids = [ids];
    }
    return del(`${ENTITY}/${ids[0]}`, { ids });
}
function addPv(id) {
    return get(`${ENTITY}/pv/${id}`);
}
function addComment(article_id, comment) { //{content}
    return post(`${ENTITY}/comment/${article_id}`, comment);
}
// DELETE /api/articles/文章的ID/comment/评论ID
function deleteComment(article_id, comment_id) {
    return del(`${ENTITY}/${article_id}/comment/${comment_id}/`);
}
export default {
    list,
    create,
    update,
    remove,
    addPv,
    addComment,
    deleteComment
}