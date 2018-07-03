import React, { Component } from 'react';
import { Row, Col, Table, Button, Modal, message, Popconfirm, Form, Input } from 'antd';
import categoryService from '../../service/category';
export default class Category extends Component {
    state = {
        items: [],
        item: {},
        title: '',
        keyword: '',
        selectedRowKeys: [],//选中行的键(行的ID)的数组
        editVisible: false,
        pagination: {},
        isCreate: true,//标识是否是添加分类,如果是true的话就是添加分类，如果为false就是修改分类
    }
    //开始执行添加操作
    create = () => {
        this.setState({
            title: '添加分类',
            isCreate: true,
            editVisible: true//此变量用来控制模态窗口是否显示
        });
    }
    componentDidMount() {
        this.getList();
    }
    //当点击分页器页码的时候，会把最新的页码传过来
    pageChange = (current) => {
        this.setState({
            pagination: { ...this.state.pagination, current }
        }, this.getList);
    }
    getList = () => {
        categoryService.list({ current: this.state.pagination.current, keyword: this.state.keyword }).then(res => {
            if (res.code == 0) {
                const { items, pageNum: current, pageSize, total } = res.data;
                this.setState({
                    items: items.map(item => (item.key = item._id, item)),
                    pagination: {
                        current,//当前页码
                        pageSize,//每页的条数
                        total,//总条数
                        showTotal: (total) => `总计${total}条`,
                        showQuickJumper: true,
                        onChange: this.pageChange //方法名叫onChange
                    }
                });
            } else {
                message.error(res.error);
            }
        });
    }
    //当点击它的时候要求将模式窗口关闭
    editCancel = () => {
        this.setState({ editVisible: false });
    }
    //当点击OK按钮的时候，要把分类保存到后台，并且关闭窗口
    editOk = () => {
        let category = this.editform.props.form.getFieldsValue();//{name:'分类1',id:'xx'}
        categoryService[this.state.isCreate ? 'create' : 'update'](category).then(res => {
            if (res.code == 0) {
                this.setState({ editVisible: false }, this.getList());
            } else {
                message.error(res.error);
            }
        })
    }
    edit = (item) => {
        this.setState({ title: '更新分类', editVisible: true, isCreate: false, item });
    }
    remove = (id) => {
        categoryService.remove(id).then(res => {
            if (res.code == 0) {
                this.setState({
                    pagination: {
                        ...this.state.pagination, current: 1
                    }
                }, this.getList);
            }
        });
    }
    render() {
        const columns = [
            {
                title: '名称',
                width: 500,
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => this.edit(record)}>修改</Button>
                            <Popconfirm onConfirm={() => this.remove(record._id)}>
                                <Button style={{ marginLeft: 10 }} type="danger">删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]
        const rowSelection = {
            //参数为选中的行的键的数组
            onChange: (selectedRowKeys) => {
                this.setState({ selectedRowKeys });
            }
        }
        return (
            <div style={{ padding: 10 }}>
                <Row style={{ marginBottom: 5 }}>
                    <Col span="12">
                        <Button.Group>
                            <Button type="default" icon="plus-circle" onClick={this.create}>添加分类</Button>
                            <Button
                                style={{ marginLeft: 15 }}
                                type="danger" icon="minus-circle-o" onClick={() => this.remove(this.state.selectedRowKeys)}>删除所选分类</Button>
                        </Button.Group>
                    </Col>
                    <Col span="12">
                        <Input.Search
                            enterButton
                            placeholder="请输入关键字"
                            onSearch={keyword => this.setState({ keyword }, this.getList)}
                        />
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={this.state.items}
                    bordered
                    pagination={this.state.pagination}
                    rowSelection={rowSelection}
                />
                <Modal
                    title={this.state.title}
                    visible={this.state.editVisible}
                    onCancel={this.editCancel}
                    onOk={this.editOk}
                    closable
                    destroyOnClose
                >
                    <WrappedEditModal
                        wrappedComponentRef={inst => this.editform = inst}
                        isCreate={this.state.isCreate}
                        item={this.state.item}
                    />
                </Modal>
            </div>
        )
    }
}
class EditModal extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('name', {
                            initialValue: this.props.isCreate ? '' : this.props.item.name,
                            rules: [{ required: true, message: '请输入分类名称' }]
                        })(<Input placeholder="请输入分类名称" />)
                    }
                </Form.Item>
                {
                    !this.props.isCreate && (
                        <Form.Item>
                            {
                                getFieldDecorator('id', {
                                    initialValue: this.props.item._id
                                })(<Input type="hidden" />)
                            }
                        </Form.Item>
                    )
                }

            </Form>
        )
    }
}
//凡是传给WrappedEditModal的属性也会原封装不动的传递给EditModal
const WrappedEditModal = Form.create()(EditModal);