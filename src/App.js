import { CopyTwoTone, SearchOutlined, SmileTwoTone } from "@ant-design/icons";
import { useMemo, useState, useRef } from "react";
import { Input, Layout, Row, Col, Typography, List, message } from "antd";

//需要管理的命令
const wholeShell = [
    'aabbcc1122333',
    '7788344bsjnkvkf',
    'hello world',
    'helloworld'
];
const { Title } = Typography;
function App() {

    const inputRef = useRef(null);
    const [shells, setShells] = useState(
        wholeShell
    )

    const inputChange = e => {
        let value = e.target.value
        if (value.length === 0) {
            setShells(wholeShell)
        } else {
            let mostMatches = new Set(wholeShell.filter(shell => shell.indexOf(value) > -1))
            let subKeyWords = value.split(' ').filter(subKeyWord => subKeyWord)
            if (subKeyWords.length > 0) {
                for (const shell of wholeShell) {
                    let match = true;
                    let indexCache = new Set()
                    for (const subKeyWord of subKeyWords) {
                        let index = shell.indexOf(subKeyWord)
                        while (indexCache.has(index)) {
                            if (index === shell.length - 1) {
                                index = -1
                                break
                            }
                            index = shell.indexOf(subKeyWord, index + 1)
                        }
                        match = match && (index > -1)
                        indexCache.add(index)
                        if (!match) {
                            break
                        }
                    }
                    if (match) {
                        mostMatches.add(shell)
                    }
                }

            }
            let withoutEmpty = value.replaceAll(' ', '')
            for (const shell of wholeShell) {
                let withoutEmptyShell = shell.replaceAll(' ', '')
                let match = true;
                let indexCache = new Set()
                for (const keywordChar of withoutEmpty) {
                    let index = withoutEmptyShell.indexOf(keywordChar)
                    while (indexCache.has(index)) {
                        if (index === withoutEmptyShell.length - 1) {
                            index = -1
                            break
                        }
                        index = withoutEmptyShell.indexOf(keywordChar, index + 1)
                    }
                    match = match && (index > -1)
                    indexCache.add(index)
                    if (!match) {
                        break
                    }
                }
                if (match) {
                    mostMatches.add(shell)
                }
            }
            setShells([...mostMatches])
        }
    }

    const shellsEle = useMemo(() => {
        const inputValue = inputRef.current?.input.value;
        const inputValueLen = inputValue?.length;
        if (!inputValue || !inputValueLen || !shells?.length) {
            return shells;
        }
        return shells.map(shell => {
            const inputValues = inputValue.split('').filter(item => item);
            return shell.split('').map((txt) => {
                const txtIdxOfInputValues = inputValues.indexOf(txt)
                if (txtIdxOfInputValues > -1) {
                    // NOTE: 删掉匹配过的元素
                    inputValues.splice(txtIdxOfInputValues, 1);
                    return `<span style='background-color: yellow'>${txt}</span>`
                }
                return txt
            }).join('')
        })
    }, [shells])
    // console.log(shellsEle)
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
                                ref={inputRef}
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
                                dataSource={shellsEle}
                                renderItem={(shell) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<SmileTwoTone />}
                                            description={<><span dangerouslySetInnerHTML={{ __html: shell }}></span> <CopyTwoTone onClick={() => {
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
