import React, {Component} from 'react'
import ReactDOM, {render} from 'react-dom'
import {Input, Button, Form, Select} from 'antd'
import categoryService from "../service/category";
import classifyService from "../service/classify";
import articleService from "../service/article";
import E from 'wangeditor'


class EditModal extends Component {
    constructor() {
        super();
        this.state = {
            categories: [],
            classifies: [],
            formItemLayout: {
                labelCol: {span: 2},
                wrapperCol: {span: 20},
            },
        };
    }

    componentDidMount() {
        const elem = this.refs.editorElem;
        const editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            this.props.form.setFieldsValue({content: html});
        };
        editor.create();
        categoryService.list({current: 1, pageSize: 100}).then(res => {
            if (res.code === 0) {
                this.setState({categories: res.data.items});
            }
        });
        classifyService.list({current: 1, pageSize: 100}).then(res => {
            if (res.code === 0) {
                this.setState({classifies: res.data.items});
            }
        });
    }

    handleSubmit = () => {
        const article = this.props.form.getFieldsValue();
        articleService.create(article).then(res => {
            if (res.code === 0) {
                this.setState({editVisible: false}, this.getList);
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form>
                <Form.Item {...this.state.formItemLayout} label="标题">
                    {
                        getFieldDecorator('title', {
                            initialValue: '',
                            rules: [{required: true, messate: '请输入标题'}]
                        })(<Input plageholder="请输入标题"/>)
                    }
                </Form.Item>
                <Form.Item {...this.state.formItemLayout} label="类型">
                    {
                        getFieldDecorator('classify', {
                            initialValue: '',
                            rules: [{required: true, messate: '请输入标题'}]
                        })(
                            <Select>
                                {
                                    this.state.classifies.map(item => (
                                        <Select.Option key={item._id} value={item._id}>
                                            {item.name}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item {...this.state.formItemLayout} label="标签">
                    {
                        getFieldDecorator('category', {
                            initialValue: '',
                            rules: [{required: true, messate: '请输入标题'}]
                        })(
                            <Select>
                                {
                                    this.state.categories.map(item => (
                                        <Select.Option key={item._id} value={item._id}>
                                            {item.name}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item {...this.state.formItemLayout} label="内容">
                    {/*{*/}
                    {/*getFieldDecorator('content', {*/}
                    {/*initialValue: '',*/}
                    {/*rules: [{required: true, messate: '请输入内容'}]*/}
                    {/*})(<Input.TextArea plageholder="请输入内容"/>)*/}
                    {/*}*/}
                    {
                        getFieldDecorator('content', {
                            initialValue: this.content,
                            rules: [{required: true, messate: '请输入内容'}]
                        })(<Input type="hidden"/>)
                    }
                    <div ref="editorElem"/>
                </Form.Item>
                <Form.Item {...this.state.formItemLayout} label=" ">
                    <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>添加文章</Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedEditModal = Form.create()(EditModal);
export default WrappedEditModal;
