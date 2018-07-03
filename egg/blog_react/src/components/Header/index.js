import React, {Component} from 'react';
import {Row, Col, Icon, message} from 'antd';
import user from '../../service/user';
import {withRouter}from 'react-router-dom';
class Header extends Component {
    constructor() {
        super();
        this.state = {username: ''};
    }

    logout = () => {
        user.signout().then(data => {
            if (data.code == 0) {
                sessionStorage.removeItem('username');
                this.props.history.push('/');
            } else {
                message.error(data.error);
            }
        });
    }

    componentWillMount() {
        let username = sessionStorage.getItem('username');
        this.setState({username});
    }

    render() {
        return (
            <Row className="admin-header">
                <Col span="6">用户管理系统</Col>
                <Col span="18">
                    <div style={{float: 'right'}}>
                        <Icon type="smile"/> 欢迎 {this.state.username}
                        <a href="javasctipt:;" onClick={this.logout}>
                            <Icon type="logout"/>
                        </a>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default withRouter(Header);