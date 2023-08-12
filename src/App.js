import { CopyTwoTone, SearchOutlined, SmileTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { Input, Layout, Row, Col, Typography, List, message } from "antd";

//需要管理的命令
const wholeShell = [

];
const { Title } = Typography;
function App() {


    const [shells, setShells] = useState(
        wholeShell
    )

    const inputChange = e => {
        let value = e.target.value
        if (value.length === 0) {
            setShells(wholeShell)
        } else {
            setShells(wholeShell.filter(shell => shell.indexOf(value) > -1))
        }
    }

    return (
        <Layout style={{ paddingTop: '100px', height: '100%' }}>
            <Row justify="center">
                <Title level={2}>Shell Command Manage</Title>
            </Row>
            <Row justify="center">
                <Col span={16}>
                    <Row justify="center">
                        <Col span={16}>
                            <Input
                                style={{ height: '42px', borderRadius: '21px', boxShadow: '0px 0px 5px rgb(212, 212, 212)', border: 'rgb(218, 218, 218) solid 1px' }}
                                allowClear
                                placeholder="Enter shell keyword"
                                prefix={<SearchOutlined />}
                                onChange={inputChange}
                            />

                            <List
                                size='small'
                                style={{ marginTop: '20px' }}
                                itemLayout="horizontal"
                                dataSource={shells}
                                renderItem={(shell) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<SmileTwoTone />}
                                            description={<>{shell} <CopyTwoTone onClick={() => {
                                                navigator.clipboard.writeText(shell)
                                                message.success({ content: 'Copied!' })
                                            }} /></>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Layout>
    );
}

export default App;
