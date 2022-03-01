import { useEffect, useState } from "react";
import { Table, Descriptions, Space, Divider } from '@arco-design/web-react';
import { IconRight, IconDown } from '@arco-design/web-react/icon';
import Progress from "./Progress";
function List({ config }) {
    const [data, setData] = useState([]);
    const [state, setState] = useState({ loading: true, hasError: false });
    useEffect(() => {
        if (!config.API) return;
        const websocket = new WebSocket(config.API);
        websocket.onmessage = function (message) {
            const json = JSON.parse(message.data);
            setTimeout(() => {
                setData(json);
                setState({ loading: false, hasError: false });
            }, 1500);
        }
        websocket.onerror = function () {
            setState({ loading: false, hasError: true });
        }
        return () => {
            if (websocket) websocket.close();
        }
    }, [config])
    // 字节计算
    function bytesToSize(bytes, precision, si) {
        let ret, megabyte, gigabyte, terabyte;
        si = typeof si !== 'undefined' ? si : 0;
        if (si !== 0) {
            megabyte = 1000 * 1000;
            gigabyte = megabyte * 1000;
            terabyte = gigabyte * 1000;
        } else {
            megabyte = 1024 * 1024;
            gigabyte = megabyte * 1024;
            terabyte = gigabyte * 1024;
        }

        if ((bytes >= megabyte) && (bytes < gigabyte)) {
            ret = (bytes / megabyte).toFixed(precision) + ' M';

        } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
            ret = (bytes / gigabyte).toFixed(precision) + ' G';

        } else if (bytes >= terabyte) {
            ret = (bytes / terabyte).toFixed(precision) + ' T';

        } else {
            return bytes + ' B';
        }

        return ret + 'B';
    }
    // 协议
    function calculateProtocol(record) {
        if (!record.state)
            return <Progress text={record.ip_version} state="danger" percent="100" />
        return <Progress text={record.ip_version} state="success" percent="100" />
    }
    function calculateOS(record) {
        return record.os.charAt(0).toUpperCase() + record.os.slice(1);
    }
    // 在线时间
    function calculateUptime(record) {
        const { uptime } = record;
        var days = Math.floor(uptime / 86400);
        var hours = Math.floor((uptime % 86400) / 3600);
        var duration = days + "天" + hours + "小时";
        return <span>{duration}</span>
    }
    // 负载
    function calculateLoad(record) {
        if (!record.state) {
            return <span>-</span>
        }
        return <span>{record.load_1}</span>
    }
    // 网络
    function calculateNetwork(record) {
        if (!record.state) {
            return "- | -"
        }
        var netstr = "";
        if (record.net_down_speed < 1024 * 1024)
            netstr += (record.net_down_speed / 1024).toFixed(2) + "KB/s";
        else
            netstr += (record.net_down_speed / 1024 / 1024).toFixed(2) + "MB/s";
        netstr += " | "
        if (record.net_up_speed < 1024 * 1024)
            netstr += (record.net_up_speed / 1024).toFixed(2) + "KB/s";
        else
            netstr += (record.net_up_speed / 1024 / 1024).toFixed(2) + "MB/s";
        return netstr;
    }
    // 总流量
    function calculateTraffic(record) {
        var trafficstr = "";
        if (record.byte_recv_total < 1024 * 1024 * 1024 * 1024)
            trafficstr += (record.byte_recv_total / 1024 / 1024 / 1024).toFixed(2) + "G";
        else
            trafficstr += (record.byte_recv_total / 1024 / 1024 / 1024 / 1024).toFixed(2) + "T";
        trafficstr += " | "
        if (record.byte_sent_total < 1024 * 1024 * 1024 * 1024)
            trafficstr += (record.byte_sent_total / 1024 / 1024 / 1024).toFixed(2) + "G";
        else
            trafficstr += (record.byte_sent_total / 1024 / 1024 / 1024 / 1024).toFixed(2) + "T";
        return trafficstr;
    }
    // CUP
    function calculateCPU(record) {
        if (!record.state) {
            return <Progress text={"- %"} state="danger" percent={100} />
        }
        const { cpu_used_pct } = record
        if (record.cpu >= 80)
            return <Progress text={cpu_used_pct + "%"} state="warning" percent={cpu_used_pct} />
        else
            return <Progress text={cpu_used_pct + "%"} state="success" percent={cpu_used_pct} />
    }
    // 内存Memory
    function calculateMemory(record) {
        if (!record.state) {
            return <Progress text={"- %"} state="danger" percent={100} />
        }
        const { mem_used_pct } = record
        const mem_used_pct_str = mem_used_pct + "%";
        if (mem_used_pct >= 90)
            return <Progress text={mem_used_pct_str} state="danger" percent={mem_used_pct} />
        else if (mem_used_pct >= 80)
            return <Progress text={mem_used_pct_str} state="warning" percent={mem_used_pct} />
        else
            return <Progress text={mem_used_pct_str} state="success" percent={mem_used_pct} />
    }
    // 硬盘HDD
    function calculateHDD(record) {
        if (!record.state) {
            return <Progress text={"- %"} state="danger" percent={100} />
        }
        const { hdd_used_pct } = record;
        const hdd_used_pct_str = hdd_used_pct + "%";
        if (hdd_used_pct >= 90)
            return <Progress text={hdd_used_pct_str} state="danger" percent={hdd_used_pct} />
        else if (hdd_used_pct >= 80)
            return <Progress text={hdd_used_pct_str} state="warning" percent={hdd_used_pct} />
        else
            return <Progress text={hdd_used_pct_str} state="success" percent={hdd_used_pct} />
    }
    // // 丢包率
    function calculatePing(record) {
        const { state, lost_rate_10000, lost_rate_10010, lost_rate_10086 } = record;
        return (
            <>
                <Space split={<Divider type='vertical' />}>
                    <span>电信：{state ? lost_rate_10000 : "-"}%</span>
                    <span>联通：{state ? lost_rate_10010 : "-"}%</span>
                    <span>移动：{state ? lost_rate_10086 : "-"}%</span>
                </Space>
            </>
        )
    }
    // 网络时延
    function calculateDelay(record) {
        if (!record.state) {
            return <Progress text={"- 💻 - 💻 -"} state="danger" percent={100} />
        }
        const { ping_10000, ping_10010, ping_10086 } = record;
        if (ping_10000 >= 60 || ping_10010 >= 60 || ping_10086 >= 60)
            return <Progress text={ping_10000 + "ms💻" + ping_10010 + "ms💻" + ping_10086 + "ms"} state="warning" percent="100" />
        else
            return <Progress text={ping_10000 + "ms💻" + ping_10010 + "ms💻" + ping_10086 + "ms"} state="success" percent="100" />
    }
    const columns = [
        {
            title: '协议',
            align: "center",
            render: (col, record) => <>{calculateProtocol(record)}</>
        },
        { title: '节点名', align: "center", dataIndex: 'name' },
        {
            title: '系统',
            align: "center",
            render: (col, record) => <>{calculateOS(record)}</>
        },
        {
            title: '位置', align: "center", render: (col, record) => (
                <img src={`https://image.onezol.com/flag/${record.location}.png`} className="location_column" alt="" />
            )
        },
        {
            title: '在线时间',
            align: "center",
            render: (col, record) => <>{calculateUptime(record)}</>
        },
        {
            title: '负载',
            align: "center",
            render: (col, record) => <>{calculateLoad(record)}</>
        },
        {
            title: '网络速度 ↓↑',
            align: "center",
            className: "speed_column",
            render: (col, record) => <>{calculateNetwork(record)}</>
        },
        {
            title: '总流量 ↓↑',
            align: "center",
            width: "140px",
            render: (col, record) => <>{calculateTraffic(record)}</>
        },
        {
            title: '处理器',
            render: (col, record) => <>{calculateCPU(record)}</>
        },
        {
            title: '内存',
            render: (col, record) => <>{calculateMemory(record)}</>
        },
        {
            title: '硬盘',
            render: (col, record) => <>{calculateHDD(record)}</>
        },
        {
            title: '网络时延(CT|CU|CM)',
            align: "center",
            render: (col, record) => <>{calculateDelay(record)}</>
        },

    ];
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    function addExpandedRowKey(key) {
        setExpandedRowKeys(expandedRowKeys.concat(key));
    }

    function removeExpandedRowKey(key) {
        setExpandedRowKeys(expandedRowKeys.filter(k => k !== key));
    }
    return (
        <div className="list_wrapper">
            <div className="list_box">
                <Table
                    columns={columns}
                    data={data || []}
                    rowKey="host"
                    pagination={false}
                    stripe={true}
                    noDataElement={
                        <h4 style={{ margin: 0, color: "rgb(var(--gray-8))" }}>{state.loading ? "内容正在加载中..." : state.hasError ? "数据通道建立失败，请检查服务器是否出现异常！" : "这里没有数据，请先创建你的客户端哦。"}</h4>
                    }
                    expandedRowRender={(record) => (
                        <Descriptions
                            border
                            data={
                                [{
                                    label: 'CPU数量',
                                    value: record.cpu_count
                                }, {
                                    label: '进程数量',
                                    value: record.state ? record.process : "-",
                                }, {
                                    label: '虚拟内存',
                                    value: (record.state ? bytesToSize(record.swap_mem_used, 1) : "-") + " / " + bytesToSize(record.swap_mem_total, 1),
                                }, {
                                    label: '物理内存',
                                    value: (record.state ? bytesToSize(record.mem_used, 1) : "-") + " / " + bytesToSize(record.mem_total, 1),
                                }, {
                                    label: '物理硬盘',
                                    value: (record.state ? bytesToSize(record.hdd_used, 1) : "-") + " / " + bytesToSize(record.hdd_total, 1),
                                }, {
                                    label: '丢包率(CT|CU|CM)',
                                    value: calculatePing(record)
                                }]
                            } />
                    )}
                    expandProps={{
                        icon: ({ expanded, record }) => expanded
                            ? <button onClick={() => removeExpandedRowKey(record.key)}><IconDown /></button>
                            : <button onClick={() => addExpandedRowKey(record.key)}><IconRight /></button>,
                        expandRowByClick: true
                    }}
                />
            </div>
        </div>
    )
}
export default List;