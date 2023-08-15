import { CopyTwoTone, SearchOutlined, SmileTwoTone } from "@ant-design/icons";
import { useMemo, useState, useRef } from "react";
import { Input, Layout, Row, Col, Typography, List, message, Tag } from "antd";

class ShellTags {
    constructor(text, tags) {
        this.text = text;
        this.tags = tags;
    }
}

//需要管理的命令
const wholeShellTags = [
    new ShellTags("ssh collector-kafka", ["rawLog", "kafka", "ansible"]),
    new ShellTags("ssh tencent-kafka", ["richLog", "kafka", "ansible"]),
];

const colors = [
    "processing",
"success",
"error",
"warning",
"magenta",
"red",
"volcano",
"orange",
"gold",
"lime",
"green",
"cyan",
"blue",
"geekblue",
"purple"]

let tags = new Set()
wholeShellTags.forEach(shellTags => {
    if(shellTags.tags.length > 0) {
        shellTags.tags.forEach(tag => tags.add(tag))
    }
})
let sortedAllTags = Array.from(tags).sort()
console.log("sortedAllTags: ", sortedAllTags)

let tag2Color = new Map();
sortedAllTags.forEach(tag => {
    tag2Color.set(tag, colors[Math.floor(Math.random() * colors.length)])
})

const { Title } = Typography;
function App() {

    const inputRef = useRef(null);
    const [shellTags, setShellTags] = useState(
        wholeShellTags
    )

    const inputChange = e => {
        let value = e.target.value
        if (value.length === 0) {
            setShellTags(wholeShellTags)
        } else {

            //解析出tags和shellKeyword
            value = value.replace(/^\s+|\s+$/g,"") //移除前后空格
            let colonIndex = value.indexOf(':')
            while(colonIndex > -1) {
                
            }

            //根据tags和shellKeyword做过滤

            let mostMatches = new Set(wholeShellTags.filter(shell => shell.indexOf(value) > -1))
            let subKeyWords = value.split(' ').filter(subKeyWord => subKeyWord)
            if (subKeyWords.length > 0) {
                for (const shell of wholeShellTags) {
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

            // //单个字符匹配
            // let withoutEmpty = value.replaceAll(' ', '')
            // for (const shell of wholeShell) {
            //     let withoutEmptyShell = shell.replaceAll(' ', '')
            //     let match = true;
            //     let indexCache = new Set()
            //     for (const keywordChar of withoutEmpty) {
            //         let index = withoutEmptyShell.indexOf(keywordChar)
            //         while (indexCache.has(index)) {
            //             if (index === withoutEmptyShell.length - 1) {
            //                 index = -1
            //                 break
            //             }
            //             index = withoutEmptyShell.indexOf(keywordChar, index + 1)
            //         }
            //         match = match && (index > -1)
            //         indexCache.add(index)
            //         if (!match) {
            //             break
            //         }
            //     }
            //     if (match) {
            //         mostMatches.add(shell)
            //     }
            // }
            setShellTags([...mostMatches])
        }
    }

    const shellTagsEle = useMemo(() => {
        const inputValue = inputRef.current?.input.value;
        const inputValueLen = inputValue?.length;
        if (!inputValue || !inputValueLen || !shellTags?.length) {
            return shellTags;
        }
        return shellTags.map(shellTags => {
            const inputValues = inputValue.split('').filter(item => item);
            return shellTags.split('').map((txt) => {
                const txtIdxOfInputValues = inputValues.indexOf(txt)
                if (txtIdxOfInputValues > -1) {
                    // NOTE: 删掉匹配过的元素
                    inputValues.splice(txtIdxOfInputValues, 1);
                    return `<span style='background-color: yellow'>${txt}</span>`
                }
                return txt
            }).join('')
        })
    }, [shellTags])
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
                                placeholder="Enter [:tags...] [shell keyword]"
                                prefix={<SearchOutlined />}
                                onChange={inputChange}
                            />

                            <List
                                size='small'
                                style={{ marginTop: '20px' }}
                                itemLayout="horizontal"
                                dataSource={shellTagsEle}
                                renderItem={(shellTags) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<SmileTwoTone />}
                                            description={<><span dangerouslySetInnerHTML={{ __html: shellTags.text }}></span> <CopyTwoTone onClick={() => {
                                                navigator.clipboard.writeText(shellTags.text)
                                                message.success({ content: 'Copied!' })
                                            }} />
                                            {shellTags.tags.map(tag => <Tag color={tag2Color.get(tag)}>{tag}</Tag>)}
                                            </>}
                                        
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
