import React, {Component} from 'react'
import {Row, Col, Table, Button, Input, Modal, message, Form, Popconfirm} from 'antd';
import classifyService from '../../service/classify';
import categoryService from "../../service/category";

export default class Classify extends Component {
    constructor() {
        super();
        this.state = {
            items: [],
            title: '',
            item: {},
            keyword: '',
            selectedRowKeys: [],
            editVisible: false,
            isCreate: true,
            loading: false,
            pagination: {},
        };
    }

    componentDidMount() {
        this.getList();
    }

    pageChange = (current) => {
        this.setState({
            pagination: {...this.state.pagination, current}
        }, this.getList);
    };
    getList = () => {
        this.setState({loading: true});
        classifyService.list({current: this.state.pagination.current, keyword: this.state.keyword}).then(res => {
            this.setState({loading: false});
            if (res.code === 0) {
                const {items, pageNum: current, pageSize, total} = res.data;
                console.log(res.data);
                this.setState({
                    items: items.map(item => (item.key = item._id, item)),
                    pagination: {
                        current,
                        pageSize,
                        total,
                        showTotal: (total) => `总计${total}条`,
                        showQuickJumper: true,
                        onChange: this.pageChange,
                    }
                });
            } else {
                message.error(res.error);
            }
        });
    };
    create = () => {
        this.setState({
            title: '添加分类',
            isCreate: true,
            editVisible: true,
        });
    };
    edit = (item) => {
        this.setState({
            title: '更新分类',
            isCreate: false,
            editVisible: true,
            item,
        });
    };
    editCancel = () => {
        this.setState({
            editVisible: false,
        });
    };
    remove = (id) => {
        classifyService.remove(id).then(res => {
            if (res.code === 0) {
                this.setState({
                    pagination: {
                        ...this.state.pagination,
                        current: 1
                    }
                }, this.getList);
            }
        })
    };
    editOk = () => {
        let classify = this.editform.props.form.getFieldsValue();
        classifyService[this.state.isCreate ? 'create' : 'update'](classify).then(res => {
            if (res.code === 0) {
                this.setState({editVisible: false}, this.getList());
            } else {
                message.error(res.error);
            }
        });
    };

    render() {
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '链接',
                dataIndex: 'link',
                key: 'link',
            }, {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        <Button.Group>
                            <Button type="primary" onClick={() => this.edit(record)}>修改</Button>
                            <Popconfirm onConfirm={() => this.remove(record._id)}>
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ];
        const rowSelection = {
            //参数为选中的行的键的数组
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys});
            }
        };
        return (<div style={{padding: 10}}>
            <Row>
                <Col span="6">
                    <Button.Group>
                        <Button type="default" onClick={this.create}>添加分类</Button>
                        <Button type="danger" onClick={() => {
                            this.remove(this.state.selectedRowKeys)
                        }}>删除所选分类</Button>
                    </Button.Group>
                </Col>
                <Col span="18">
                    <Input.Search
                        enterButton
                        plageholder="请输入关键字"
                        onSearch={keyword => this.setState({keyword}, this.getList)}
                    />
                </Col>
            </Row>
            <Table
                loading={this.state.loading}
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
                destroyOnClose          // 关闭弹框销毁数据
            >
                <WrappedEditModal
                    wrappedComponentRef={inst => this.editform = inst}          // 拿到被包裹的组件
                    isCreate={this.state.isCreate}
                    item={this.state.item}
                />
            </Modal>
        </div>);
    }
}

class EditModal extends Component {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('name', {
                            initialValue: this.props.isCreate ? '' : this.props.item.name,  // 回填值
                            rules: [{required: true, message: '请输入标签名称'}]
                        })(<Input plageholder="请输入标签名称"/>)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('link', {
                            initialValue: this.props.isCreate ? '' : this.props.item.link,  // 回填值
                            rules: [{required: true, message: '请输入链接'}]
                        })(<Input plageholder="请输入链接"/>)
                    }
                </Form.Item>
                {
                    !this.props.isCreate && (
                        <Form.Item>
                            {
                                getFieldDecorator('id', {
                                    initialValue: this.props.item._id
                                })(<Input type="hidden"/>)
                            }
                        </Form.Item>
                    )
                }
            </Form>
        )
    }
}

// 凡是传给WrappedEditModal也会原封不动的传给EditModal
const WrappedEditModal = Form.create()(EditModal);