import { CopyTwoTone, SearchOutlined, SmileTwoTone } from "@ant-design/icons";
import { useMemo, useState, useRef, useEffect } from "react";
import { groupBy } from "lodash-es";
import {
  Input,
  Row,
  Col,
  Typography,
  List,
  message,
  Tag,
  Card,
  Space,
} from "antd";

class ShellTags {
  constructor(text, tags) {
    this.text = text;
    this.tags = tags;
  }
}

//需要管理的命令
//new ShellTags("ssh tencent-kafka", ["richLog", "kafka", "ansible"]),
const wholeShellTags = [
];

function getTagsByCommand(command) {
  return wholeShellTags.find(({ text }) => text.trim() === command.trim())
    ?.tags;
}

const colors = [
  "#f50",
  "#2db7f5",
  "#87d068",
  "#108ee9",
  "blue",
  "geekblue",
  "purple",
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
];

const tags = new Set();
wholeShellTags.forEach((shellTags) => {
  if (shellTags.tags.length > 0) {
    shellTags.tags.forEach((tag) => tags.add(tag));
  }
});
const sortedAllTags = Array.from(tags).sort();
const tag2Color = new Map();
sortedAllTags.forEach((tag, index) => {
  // NOTE: 不要随机颜色，会导致不同的标签颜色一样
  tag2Color.set(tag, colors[index]);
});

const tagsGroup = Object.values(groupBy(sortedAllTags, (tag) => tag[0]));

const wholeShell = wholeShellTags.map((shellTag) => shellTag.text);

const { Title } = Typography;
function App() {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [shells, setShells] = useState(wholeShell);
  function onTagClick(tag) {
    const tags = inputValue
      .split(" ")
      .filter((item) => item.startsWith(":"))
      .map((item) => item.substring(1))
      .filter((item) => item.trim());
    if (!tags.includes(tag.trim())) {
      inputRef.current?.focus();
      setInputValue((value) => {
        const newValue = `:${tag} ${value}`;
        return newValue;
      });
    }
  }

  useEffect(() => {
    processSearchByValue(inputValue);
  }, [inputValue]);

  function processSearchByValue(value) {
    if (value.length === 0) {
      setShells(wholeShell);
    } else {
      const tags = value
        .split(" ")
        .filter((item) => item.startsWith(":"))
        .map((item) => item.substring(1))
        .filter((item) => item.trim());
      const command = value
        .split(" ")
        .filter((item) => !item.startsWith(":"))
        .join(" ");
      // NOTE: 开始匹配，按照 tags 匹配，然后按照 command 匹配
      // ***** tags匹配 *****
      let matchedCommandbyTags = wholeShell;
      if (tags.length) {
        matchedCommandbyTags = wholeShellTags
          .filter((shellTag) => {
            return tags.every((tag) => shellTag.tags.includes(tag.trim()));
          })
          .map((shellTag) => shellTag.text);
      }
      // ***** 命令匹配 *****
      let mostMatches = new Set(
        matchedCommandbyTags.filter((shell) => shell.indexOf(command) > -1)
      );
      let subKeyWords = command.split(" ").filter((subKeyWord) => subKeyWord);
      if (subKeyWords.length > 0) {
        for (const shell of matchedCommandbyTags) {
          let match = true;
          let indexCache = new Set();
          // 当使用通过空格分割的command搜索时，命令中同时包含空格分割的关键词的命令才会被搜到
          for (const subKeyWord of subKeyWords) {
            let index = shell.indexOf(subKeyWord);
            while (indexCache.has(index)) {
              if (index === shell.length - 1) {
                index = -1;
                break;
              }
              index = shell.indexOf(subKeyWord, index + 1);
            }
            match = match && index > -1;
            indexCache.add(index);
            if (!match) {
              break;
            }
          }
          if (match) {
            mostMatches.add(shell);
          }
        }
      }
      let withoutEmpty = command.replaceAll(" ", "");
      for (const shell of matchedCommandbyTags) {
        let withoutEmptyShell = shell.replaceAll(" ", "");
        let match = true;
        let indexCache = new Set();
        for (const keywordChar of withoutEmpty) {
          let index = withoutEmptyShell.indexOf(keywordChar);
          while (indexCache.has(index)) {
            if (index === withoutEmptyShell.length - 1) {
              index = -1;
              break;
            }
            index = withoutEmptyShell.indexOf(keywordChar, index + 1);
          }
          match = match && index > -1;
          indexCache.add(index);
          if (!match) {
            break;
          }
        }
        if (match) {
          mostMatches.add(shell);
        }
      }

      setShells([...mostMatches]);
    }
  }
  const inputChange = (e) => {
    let value = e.target.value;
    setInputValue(value);
  };

  const shellsEle = useMemo(() => {
    const inputValue = inputRef.current?.input.value;
    const inputValueLen = inputValue?.length;
    if (!inputValue || !inputValueLen || !shells?.length) {
      return shells;
    }
    const command = inputValue
      .split(" ")
      .filter((item) => !item.startsWith(":"))
      .join(" ");
    return shells.map((shell) => {
      const inputValues = command.split("").filter((item) => item.trim());
      return shell
        .split("")
        .map((txt) => {
          const txtIdxOfInputValues = inputValues.indexOf(txt);
          if (txtIdxOfInputValues > -1) {
            // NOTE: 删掉匹配过的元素
            inputValues.splice(txtIdxOfInputValues, 1);
            return `<span style='background-color: yellow'>${txt}</span>`;
          }
          return txt;
        })
        .join("");
    });
  }, [shells]);
  return (
    <Row style={{ paddingTop: "100px" }}>
      <Col span={16}>
        <Row justify="center">
          <Title level={2}>Shell Command Manage</Title>
        </Row>

        <Row justify="center">
          <Col span={20}>
            <Row justify="center">
              <Col span={20}>
                <Input
                  value={inputValue}
                  ref={inputRef}
                  style={{
                    height: "42px",
                    borderRadius: "21px",
                    boxShadow: "0px 0px 5px rgb(212, 212, 212)",
                    border: "rgb(218, 218, 218) solid 1px",
                  }}
                  allowClear
                  placeholder="Enter [:tags...] [shell keyword]"
                  prefix={<SearchOutlined />}
                  onChange={inputChange}
                />

                <List
                  size="small"
                  style={{ marginTop: "20px" }}
                  itemLayout="horizontal"
                  dataSource={shellsEle}
                  renderItem={(shell, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                        avatar={<SmileTwoTone />}
                        description={
                          <Row justify="space-between">
                            <Col>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: shell,
                                }}
                              ></span>
                              <CopyTwoTone
                                onClick={() => {
                                  navigator.clipboard.writeText(shells[index]);
                                  message.success({ content: "Copied!" });
                                }}
                              />
                            </Col>
                            <Col>
                              {getTagsByCommand(shells[index])
                                ?.sort()
                                .map((tag) => (
                                  <Tag key={tag} color={tag2Color.get(tag)}>
                                    {tag}
                                  </Tag>
                                ))}
                            </Col>
                          </Row>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col>
        <Card title="Tag" style={{ width: 350, marginTop: '78px' }}>
          <Space direction="vertical">
            {tagsGroup.map((tags) => {
              return (
                <div key={tags[0][0]}>
                  <Space>
                    {tags.map((tag) => (
                      <Tag style={{cursor: 'pointer'}}
                        onClick={() => onTagClick(tag)}
                        key={tag}
                        color={tag2Color.get(tag)}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </div>
              );
            })}
          </Space>
        </Card>
      </Col>
    </Row>
  );
}

export default App;


