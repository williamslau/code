import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Header from '../../components/Header';
import NavLeft from '../../components/Navleft';
import { Route } from 'react-router-dom';
import Welcome from '../welcome';
import Category from '../category';
import Article from '../article';
export default class Admin extends Component {
    render() {
        return (
            <Row className="admin-page">
                <Header />
                <Row>
                    <Col span="4" >
                        <NavLeft />
                    </Col>
                    <Col span="20">
                        <Route exact path="/admin" component={Welcome} />
                        <Route path="/admin/category" component={Category} />
                        <Route path="/admin/article" component={Article} />
                    </Col>
                </Row>
            </Row>

        )
    }
}