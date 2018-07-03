import React, { Component } from 'react';
import { Form, Input, Icon, Button, Popconfirm, Modal, message } from 'antd';
import service from '../../service/user';
export default class Home extends Component {
    handleSubmit = (isSignUp, user) => {
        service[isSignUp ? 'signup' : 'signin'](user).then(res => {
            if (res.code == 0) {
                if (!isSignUp) {
                    sessionStorage.setItem('username', res.data.user.username);
                }
                this.props.history.push('/admin');
            } else {
                message.error(res.error);
            }
        })
    }
    render() {
        return (
            <div className="home-page">
                <div className="login-form">
                    <h1>欢迎光临珠峰博客</h1>
                    <WrappedUserForm onSubmit={this.handleSubmit} />
                </div>
            </div>
        )
    }
}
class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = { isSignUp: true };//默认是一个注册表单
    }
    checkUsername = (rule, value, callback) => {
        if (!value) {
            callback('用户名不能为空');
        } else if (!/^1\d{10}$/.test(value)) {
            callback('用户必须是一个手机号!');
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={(e) => {
                e.preventDefault();
                this.props.onSubmit(
                    this.state.isSignUp,
                    this.props.form.getFieldsValue()
                )
            }}>
                <Form.Item>
                    {
                        getFieldDecorator('username', {
                            rules: [{ validator: this.checkUsername }, { required: true, message: '请输入用户名' }]
                        })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入用户名' }]
                        })(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入密码" />)
                    }
                </Form.Item>
                {
                    this.state.isSignUp && <Form.Item>
                        {
                            getFieldDecorator('email', {
                                rules: [{ required: true, message: '请输入邮箱' }]
                            })(<Input type="email" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入邮箱" />)
                        }
                    </Form.Item>
                }

                <Form.Item>
                    <Button
                        htmlType="submit"
                        className="login-form-button">
                        {this.state.isSignUp ? '注册' : '登录'}
                    </Button>
                    <a onClick={() => this.setState({ isSignUp: !this.state.isSignUp })}>{this.state.isSignUp ? '已有账号，直接登录?' : '没有账号，请注册'}</a>
                </Form.Item>
            </Form>
        )
    }
}
const WrappedUserForm = Form.create()(UserForm)