import React, {Component} from 'react';
import {Menu} from 'antd';
import {withRouter, Link} from 'react-router-dom';

class Navleft extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Menu
                    mode="inline"
                    theme="light"
                    onClick={this.handleClick}
                    defaultSelectedKeys={[window.location.hash.slice(1)]}
                >
                    <Menu.Item key="/admin">
                        <Link to="/admin">首页</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/category">
                        <Link to="/admin/category">标签管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/classify">
                        <Link to="/admin/classify">分类管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/article">
                        <Link to="/admin/article">文章管理</Link>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}
export default withRouter(Navleft);