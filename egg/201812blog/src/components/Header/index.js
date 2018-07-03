import React, { Component } from 'react';
import { Row, Col, Icon, message } from 'antd';
import user from '../../service/user';
import { withRouter } from 'react-router-dom';
class Header extends Component {
    state = {
        username: ''
    }
    componentWillMount() {
        let username = sessionStorage.getItem('username');
        this.setState({ username });
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
    render() {
        return (
            <Row className="admin-header" >
                <Col span="12" >
                    珠峰博客
                </Col>
                <Col span="12">
                    <div style={{ float: 'right', fontSize: 16 }}>
                        <Icon type="smile" />欢迎 {this.state.username}
                        <a onClick={this.logout}><Icon type="logout" />退出</a>
                    </div>
                </Col>
            </Row>
        )
    }
}
export default withRouter(Header);