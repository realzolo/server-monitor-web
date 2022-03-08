import { useEffect, useState } from "react";
import { Table, Descriptions } from '@arco-design/web-react';
import { IconRight, IconDown } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next'
import { bytesToSize } from "../utils/calc_bytes";
import Loading from "./Loading";
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
    getLatency
} from "../utils/calc_column";

function List({ config }) {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [state, setState] = useState({ loading: true, hasError: false });
    useEffect(() => {
        if (!config.WEBSOCKET_URL) return;
        const websocket = new WebSocket(config.WEBSOCKET_URL);
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
    }, [config])

    const columns = [
        {
            title: t('column.protocol'),
            align: "center",
            render: (col, record) => <>{getProtocol(record)}</>
        },
        {
            title: t('column.name'),
            align: "center",
            dataIndex: 'name'
        },
        {
            title: t('column.os'),
            align: "center",
            render: (col, record) => (
                <img src={`https://image.onezol.com/os/${(record.platform)?.toLowerCase()}.png`} width="20px" alt="" />
            )
        },
        {
            title: t('column.location'),
            align: "center",
            render: (col, record) => (
                <img src={`https://image.onezol.com/flag/${record.location}.png`} style={{ width: "24px", borderRadius: "3px" }} alt="" />
            )
        },
        {
            title: t('column.uptime'),
            align: "center",
            render: (col, record) => <>{getUptime(record)}</>
        },
        {
            title: t('column.load'),
            align: "center",
            render: (col, record) => <>{getLoad(record)}</>
        },
        {
            title: t('column.net_speed'),
            align: "center",
            className: "speed_column",
            render: (col, record) => <>{getNetwork(record)}</>
        },
        {
            title: t('column.total_bytes'),
            align: "center",
            className: "bytes_column",
            render: (col, record) => <>{getTraffic(record)}</>
        },
        {
            title: t('column.cpu'),
            className: "cpu_column",
            render: (col, record) => <>{getCPU(record)}</>
        },
        {
            title: t('column.memory'),
            align: "center",
            render: (col, record) => <>{getMemory(record)}</>
        },
        {
            title: t('column.hard_disk'),
            align: "center",
            render: (col, record) => <>{getHDD(record)}</>
        },
        {
            title: t('column.net_latency'),
            align: "center",
            render: (col, record) => <>{getLatency(record)}</>
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
                {
                    state.loading ?
                        (<Loading tip={t('tips.loading')} />)
                        :
                        (<Table
                            columns={columns}
                            data={data || []}
                            rowKey="host"
                            pagination={false}
                            noDataElement={
                                <h4 style={{ margin: 0, color: "rgb(var(--gray-8))" }}>{state.hasError ? t('tips.net_error') : t('tips.no_data')}</h4>
                            }
                            expandedRowRender={(record) => (
                                <Descriptions
                                    border
                                    data={
                                        [{
                                            label: t('detail.cpu_count'),
                                            value: record.cpu_count || 1
                                        }, {
                                            label: t('detail.process_count'),
                                            value: record.state ? record.process : "-",
                                        }, {
                                            label: t('detail.swap_memory'),
                                            value: (record.state ? bytesToSize(record.swap_mem_used, 1) : "-") + " / " + bytesToSize(record.swap_mem_total, 1),
                                        }, {
                                            label: t('detail.memory'),
                                            value: (record.state ? bytesToSize(record.mem_used, 1) : "-") + " / " + bytesToSize(record.mem_total, 1),
                                        }, {
                                            label: t('detail.hard_disk'),
                                            value: (record.state ? bytesToSize(record.hdd_used, 1) : "-") + " / " + bytesToSize(record.hdd_total, 1),
                                        }, {
                                            label: t('detail.packet_loss'),
                                            value: getPing(record)
                                        }]
                                    } />
                            )}
                            expandProps={{
                                icon: ({ expanded, record }) => expanded
                                    ? <button onClick={() => removeExpandedRowKey(record.key)}><IconDown /></button>
                                    : <button onClick={() => addExpandedRowKey(record.key)}><IconRight /></button>,
                                expandRowByClick: true
                            }}
                        />)
                }
            </div>
        </div>
    )
}
export default List;