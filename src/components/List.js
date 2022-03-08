import { useEffect, useState } from "react";
import { Table, Descriptions, Card, Badge, Alert } from "@arco-design/web-react";
import { IconRight, IconDown } from "@arco-design/web-react/icon";
import { useTranslation } from "react-i18next"
import Loading from "./Loading";
import { bytesToSize } from "../utils/calc_bytes";
import { isPhoneWidth } from "../utils/calc_width";
import {
    getProtocol,
    getUptime,
    getLoad,
    getNetwork,
    getTraffic,
    getCPU,
    getMemory,
    getHDD,
    getPing,
    getLatency,
    getDetailLoad,
    getDetailUptime
} from "../utils/calc_column";

function List({ config }) {
    const { websocket_url } = config;
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [state, setState] = useState({ loading: true, hasError: false });
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    useEffect(() => {
        if (!websocket_url) return;
        const websocket = new WebSocket(websocket_url);
        websocket.onmessage = function (message) {
            const json = JSON.parse(message.data);
            setData(json);
            setState({ loading: false, hasError: false });
        }
        websocket.onerror = function () {
            setState({ loading: false, hasError: true });
        }
        return () => {
            if (websocket) websocket.close();
        }
    }, [websocket_url])

    const columns = [
        {
            title: t("column.protocol"),
            align: "center",
            render: (col, record) => <>{getProtocol(record)}</>
        },
        {
            title: t("column.name"),
            align: "center",
            dataIndex: "name"
        },
        {
            title: t("column.os"),
            align: "center",
            render: (col, record) => (
                <img src={`https://image.onezol.com/os/${(record.platform)?.toLowerCase()}.png`} width="20px" alt="" />
            )
        },
        {
            title: t("column.location"),
            align: "center",
            render: (col, record) => (
                <img src={`https://image.onezol.com/flag/${record.location}.png`} style={{ width: "24px", borderRadius: "3px" }} alt="" />
            )
        },
        {
            title: t("column.uptime"),
            align: "center",
            render: (col, record) => <>{getUptime(record)}</>
        },
        {
            title: t("column.load"),
            align: "center",
            render: (col, record) => <>{getLoad(record)}</>
        },
        {
            title: t("column.net_speed"),
            align: "center",
            className: "speed_column",
            render: (col, record) => <>{getNetwork(record)}</>
        },
        {
            title: t("column.total_bytes"),
            align: "center",
            className: "bytes_column",
            render: (col, record) => <>{getTraffic(record)}</>
        },
        {
            title: t("column.cpu"),
            className: "cpu_column",
            render: (col, record) => <>{getCPU(record)}</>
        },
        {
            title: t("column.memory"),
            align: "center",
            render: (col, record) => <>{getMemory(record)}</>
        },
        {
            title: t("column.hard_disk"),
            align: "center",
            render: (col, record) => <>{getHDD(record)}</>
        },
        {
            title: t("column.net_latency"),
            align: "center",
            render: (col, record) => <>{getLatency(record)}</>
        },
    ];
    return (
        <div className="list_wrapper">
            {
                isPhoneWidth() ? (
                    <div className="list_card">
                        {
                            state.loading ?
                                (
                                    <Loading tip={t("tips.loading")} />
                                ) :
                                data.length === 0 ?
                                    (
                                        <Alert type="info" title="Tips" content={t("tips.no_data")} />
                                    ) :
                                    (
                                        <>
                                            {
                                                data.map(record =>
                                                    <Card style={{ width: "90vw", marginBottom: 15 }} title={<div className="list_card_title_wrapper"><img src={`https://image.onezol.com/os/${(record.platform)?.toLowerCase()}.png`} width="20px" alt="" />{record.name}</div>} extra={<Badge status={record.state ? "success" : "error"} text={record.state ? t("state.running") : t("state.error")} />}>
                                                        <Descriptions
                                                            column={1}
                                                            colon=":"
                                                            data={[
                                                                {
                                                                    label: t("column.protocol"),
                                                                    value: record.ip_version
                                                                }, {
                                                                    label: t("column.location"),
                                                                    value: <img src={`https://image.onezol.com/flag/${record.location}.png`} style={{ width: "24px", borderRadius: "3px" }} alt="" />
                                                                }, {
                                                                    label: t("column.uptime"),
                                                                    value: getDetailUptime(record)
                                                                }, {
                                                                    label: t("column.load"),
                                                                    value: getDetailLoad(record)
                                                                }, {
                                                                    label: t("column.net_speed"),
                                                                    value: getNetwork(record)
                                                                }, {
                                                                    label: t("column.total_bytes"),
                                                                    value: getTraffic(record)
                                                                }, {
                                                                    label: t("column.cpu"),
                                                                    value: getCPU(record)
                                                                }, {
                                                                    label: t("column.memory"),
                                                                    value: getMemory(record)
                                                                }, {
                                                                    label: t("column.hard_disk"),
                                                                    value: getHDD(record)
                                                                }, {
                                                                    label: t("column.net_latency"),
                                                                    value: getLatency(record)
                                                                }
                                                            ]}
                                                            style={{ marginBottom: 20 }}
                                                            labelStyle={{ paddingRight: 36 }}
                                                        />
                                                    </Card>
                                                )
                                            }
                                        </>
                                    )
                        }
                    </div>
                ) : (
                    <div className="list_table">
                        {
                            state.loading ?
                                (<Loading tip={t("tips.loading")} />)
                                :
                                (<Table
                                    columns={columns}
                                    data={data || []}
                                    rowKey="host"
                                    pagination={false}
                                    noDataElement={
                                        <h4 style={{ margin: 0, color: "rgb(var(--gray-8))" }}>{state.hasError ? t("tips.net_error") : t("tips.no_data")}</h4>
                                    }
                                    expandedRowRender={(record) => (
                                        <Descriptions
                                            border
                                            column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4 }}
                                            data={
                                                [{
                                                    label: t("detail.cpu_count"),
                                                    value: record.cpu_count || 1
                                                }, {
                                                    label: t("detail.process_count"),
                                                    value: record.state ? record.process : "-",
                                                }, {
                                                    label: t("detail.swap_memory"),
                                                    value: (record.state ? bytesToSize(record.swap_mem_used, 1) : "-") + " / " + bytesToSize(record.swap_mem_total, 1),
                                                }, {
                                                    label: t("detail.memory"),
                                                    value: (record.state ? bytesToSize(record.mem_used, 1) : "-") + " / " + bytesToSize(record.mem_total, 1),
                                                }, {
                                                    label: t("detail.hard_disk"),
                                                    value: (record.state ? bytesToSize(record.hdd_used, 1) : "-") + " / " + bytesToSize(record.hdd_total, 1),
                                                }, {
                                                    label: t("detail.packet_loss"),
                                                    value: getPing(record)
                                                }, {
                                                    label: t("detail.load"),
                                                    value: getDetailLoad(record)
                                                }, {
                                                    label: t("detail.uptime"),
                                                    value: getDetailUptime(record)
                                                }
                                                ]
                                            } />
                                    )}
                                    expandProps={{
                                        icon: ({ expanded, record }) => expanded
                                            ? <button onClick={() => setExpandedRowKeys(expandedRowKeys.concat(record.key))}><IconDown /></button>
                                            : <button onClick={() => setExpandedRowKeys(expandedRowKeys.filter(k => k !== record.key))}><IconRight /></button>,
                                        expandRowByClick: true
                                    }}
                                />)
                        }
                    </div>
                )
            }
        </div>
    )
}
export default List;