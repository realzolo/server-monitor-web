
import { Space, Divider } from "@arco-design/web-react";
import Progress from "../components/Progress";
import { getLanguage } from "./calc_language";

// 协议
export function getProtocol(record) {
    return <Progress text={record.ip_version} state={record.state ? "success" : "danger"} percent="100" />
}
// 在线时间
export function getUptime(record) {
    const { uptime } = record;
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    return getLanguage() === "zh-CN" ? <span>{days + "天" + hours + "小时"}</span> : <span>{days + (days > 1 ? " Days" : " Day")}</span>
}
// 在线时间
export function getDetailUptime(record) {
    const { uptime } = record;
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    return getLanguage() === "zh-CN" ? <span>{days + "天" + hours + "小时"}</span> : <span>{days + (days > 1 ? " days and " : " day and ") + hours + (hours > 1 ? " hours" : " hour")}</span>
}
// 负载
export function getLoad(record) {
    return <span>{record.state ? record.load_1 : "-"}</span>
}
// 负载
export function getDetailLoad(record) {
    return <>{record.load_1}<Divider type="vertical" />{record.load_5}<Divider type="vertical" />{record.load_15}</>;
}
// 网络
export function getNetwork(record) {
    const { state, net_down_speed, net_up_speed } = record;
    if (!state) return <>-<Divider type="vertical" />-</>;
    const netDown = net_down_speed < (1 << 20) ?
        (net_down_speed / (1 << 10)).toFixed(2) + "KB/s" :
        (net_down_speed / (1 << 20)).toFixed(2) + "MB/s";
    const netUp = net_up_speed < (1 << 20) ?
        (net_up_speed / (1 << 10)).toFixed(2) + "KB/s" :
        (net_up_speed / (1 << 20)).toFixed(2) + "MB/s";
    return <>{netDown}<Divider type="vertical" />{netUp}</>;
}
// 总流量
export function getTraffic(record) {
    const { byte_recv_total, byte_sent_total } = record;
    const byteRecv = byte_recv_total < ((1 << 20) * (1 << 20)) ?
        (byte_recv_total / (1 << 30)).toFixed(2) + "G" :
        (byte_recv_total / ((1 << 20) * (1 << 20))).toFixed(2) + "T";
    const byteSent = byte_sent_total < ((1 << 20) * (1 << 20)) ?
        (byte_sent_total / (1 << 30)).toFixed(2) + "G" :
        (byte_sent_total / ((1 << 20) * (1 << 20))).toFixed(2) + "T";
    return <>{byteRecv}<Divider type="vertical" />{byteSent}</>;
}
// CUP
export function getCPU(record) {
    const { state, cpu_used_pct } = record;
    if (!state) return <Progress text={"- %"} state="danger" percent={100} />
    return cpu_used_pct >= 80 ?
        <Progress text={cpu_used_pct + "%"} state="warning" percent={cpu_used_pct} /> :
        <Progress text={cpu_used_pct + "%"} state="success" percent={cpu_used_pct} />;
}
// 内存Memory
export function getMemory(record) {
    const { state, mem_used_pct, } = record;
    if (!state) return <Progress text={"- %"} state="danger" percent={100} />
    const mem_used_pct_str = mem_used_pct + "%";
    if (mem_used_pct >= 90)
        return <Progress text={mem_used_pct_str} state="danger" percent={mem_used_pct} />
    else if (mem_used_pct >= 80)
        return <Progress text={mem_used_pct_str} state="warning" percent={mem_used_pct} />
    else
        return <Progress text={mem_used_pct_str} state="success" percent={mem_used_pct} />
}
// 硬盘HDD
export function getHDD(record) {
    const { state, hdd_used_pct } = record;
    if (!state) return <Progress text={"- %"} state="danger" percent={100} />
    const hdd_used_pct_str = hdd_used_pct + "%";
    if (hdd_used_pct >= 90)
        return <Progress text={hdd_used_pct_str} state="danger" percent={hdd_used_pct} />
    else if (hdd_used_pct >= 80)
        return <Progress text={hdd_used_pct_str} state="warning" percent={hdd_used_pct} />
    else
        return <Progress text={hdd_used_pct_str} state="success" percent={hdd_used_pct} />
}
// 丢包率
export function getPing(record) {
    const { state, lost_rate_10000, lost_rate_10010, lost_rate_10086 } = record;
    const isCN = getLanguage() === "zh-CN";
    return (
        <>
            <Space split={<Divider type="vertical" />}>
                <span>{isCN ? "电信：" : "CT："}{state ? Math.abs(lost_rate_10000) : "-"}%</span>
                <span>{isCN ? "联通：" : "CU："}{state ? Math.abs(lost_rate_10010) : "-"}%</span>
                <span>{isCN ? "移动：" : "CM："}{state ? Math.abs(lost_rate_10086) : "-"}%</span>
            </Space>
        </>
    )
}
// 网络时延
export function getLatency(record) {
    const { state, ping_10000, ping_10010, ping_10086 } = record;
    if (!state) return <Progress text={"- ⚡ - ⚡ -"} state="danger" percent={100} />
    if (ping_10000 >= 90 || ping_10010 >= 90 || ping_10086 >= 90)
        return <Progress text={ping_10000 + "ms⚡" + ping_10010 + "ms⚡" + ping_10086 + "ms"} state="warning" percent="100" />
    else
        return <Progress text={ping_10000 + "ms⚡" + ping_10010 + "ms⚡" + ping_10086 + "ms"} state="success" percent="100" />
}