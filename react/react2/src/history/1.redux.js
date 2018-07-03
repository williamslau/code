

// 先定义好我要干那些事 （常量）
const CHANGE_TITLE_COLOR = 'CHANGE_TITLE_COLOR';
const CHANGE_CONTENT_TEXT = 'CHANGE_CONTENT_TEXT';

// 数据源
// 想要外面不可以随便更改state里的内容就要将它私有化，闭包，函数内的能调用还是外的不能调用
// 将状态放到容器中，外部无法再更改了
function createStore(reducer) {
    let state;
    let listeners = [];
    let subscribe = (listener) => {         // 订阅
        listeners.push(listener);
        return () => {
            //再次调用时移除监听函数
            listeners = listeners.filter(fn => fn != listener);
        }
    }
    let getState = () => JSON.parse(JSON.stringify(state));
    // 更改状态的方法 派发的方法
    // 派发时应该将修改的动作提交过来
    // dispacth参数应该是对象{type:'CHANGE_TITLE_COLOR',color:'red'}
    function dispatch(action) {
        state = reducer(state, action);
        // 发布
        listeners.forEach(listener => listener());
    }
    dispatch({})    // 不能什么都不传，不传是undefined,switch(undefined.type)报错，所以传个空对象
    // 将方法暴露给外面使用,dispatch修改数据，getState获取数据
    return { dispatch, getState, subscribe }
}
// 将定义状态和规则的部分抽离到外面

let initState = {
    title: {
        color: 'red',
        text: '标题'
    },
    content: {
        color: 'blue',
        text: '内容'
    }
};
// 用户自己定义的规则，也就是管理员
// reducer有两个参数 要根据老的状态和新传递的动作算出一个新的状态
// 如果想获取默认状态，有一种方式就是调用reducer 让每一个规则都不匹配，将默认值返回
// 在reducer中，reducer是一个纯函数，每次需要返回一个新的状态，将老的状态给覆盖掉
function reducer(state = initState, action) {
    switch (action.type) {
        case CHANGE_TITLE_COLOR:
            return { ...state, title: { ...state.title, color: action.color } }
        case CHANGE_CONTENT_TEXT:
            return { ...state, content: { ...state.content, text: action.text } }
        default:
            return state;
    }
}

// 渲染标题
let store = createStore(reducer);

function renderTitle() {
    let title = document.querySelector('#title');
    title.style.background = store.getState().title.color;
    title.innerHTML = store.getState().title.text;
}
// 渲染内容
function renderContent() {
    let content = document.querySelector('#content');
    content.style.background = store.getState().content.color;
    content.innerHTML = store.getState().content.text;
}
// 渲染的方法
function render() {
    renderTitle();
    renderContent();
}
render();
let unsub=store.subscribe(render);
// 发布订阅，先将render方法定义好，每次dispatch时都调用订阅好的方法
setTimeout(() => {
    // unsub();
    store.dispatch({ type: CHANGE_CONTENT_TEXT, text: 'william' });
}, 1000);
// 1.状态不应该是全局的，也不应该那个方法里直接可以更改（操作危险）
// 2.提供一个改状态的方法，不要让用户修改方法
// 3.每次修改状态时需要调用一个dispatch方法，调用时直接提供一个对象，带有type类型的，来告诉他怎样更改