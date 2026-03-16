import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { useAppContext } from './AppContext';
import CourseReportModal from './CourseReportModal';
export default function Home() {
  const navigate = useNavigate();
  const { user, reportStatus, activeChapter, setActiveChapter } =
    useAppContext();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showLearnMenu, setShowLearnMenu] = useState(false);

  // 新增：控制第二章展开/折叠的状态
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({
    '2': true, // 默认展开第二章
  });

  // 切换章节展开/折叠
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const canViewReport =
    reportStatus.pre || reportStatus.in || reportStatus.post;

  const radarOption = {
    color: ['#2b5df2'],
    tooltip: {},
    radar: {
      indicator: [
        { name: '数据感知力', max: 100 },
        { name: '概率建模力', max: 100 },
        { name: '统计推断力', max: 100 },
        { name: '结果解释力', max: 100 },
      ],
      axisName: { color: '#666677', fontSize: 13 },
      splitArea: {
        areaStyle: { color: ['rgba(43,93,242,0.02)', 'rgba(43,93,242,0.05)'] },
      },
    },
    series: [
      {
        type: 'radar',
        data: [{ value: [82, 75, 78, 70], name: '当前能力画像' }],
        areaStyle: { color: 'rgba(43, 93, 242, 0.2)' },
      },
    ],
  };

  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['数据感知', '概率建模', '统计推断', '结果解释'],
      bottom: 0,
    },
    grid: {
      top: '10%',
      left: '5%',
      right: '5%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 15 }, (_, i) => `第${i + 1}节`),
    },
    yAxis: { type: 'value', max: 100 },
    series: [
      {
        name: '数据感知',
        type: 'line',
        smooth: true,
        data: [60, 65, 68, 70, 72, 75, 76, 78, 79, 80, 81, 81, 82, 82, 82],
        itemStyle: { color: '#2b5df2' },
      },
      {
        name: '概率建模',
        type: 'line',
        smooth: true,
        data: [55, 58, 60, 62, 65, 68, 69, 70, 71, 73, 74, 74, 75, 75, 75],
        itemStyle: { color: '#00d084' },
      },
      {
        name: '统计推断',
        type: 'line',
        smooth: true,
        data: [50, 55, 60, 65, 68, 70, 72, 74, 75, 76, 77, 77, 78, 78, 78],
        itemStyle: { color: '#ff9f43' },
      },
      {
        name: '结果解释',
        type: 'line',
        smooth: true,
        data: [45, 50, 55, 58, 60, 62, 65, 66, 68, 68, 69, 69, 70, 70, 70],
        itemStyle: { color: '#ee5253' },
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      <header className="header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="avatar avatar-ai">通</div>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            概率与数理统计 - 智能学习系统
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>你好，{user?.name || '张庭玮'}</span>
          <span style={{ cursor: 'pointer', fontSize: '20px' }}>🔔</span>
          <span style={{ cursor: 'pointer', fontSize: '20px' }}>⚙️</span>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="grid-top">
          <div className="glass-card">
            <h3
              style={{
                marginBottom: '16px',
                fontSize: '16px',
                borderBottom: '1px solid #eee',
                paddingBottom: '8px',
              }}
            >
              个性化路径卡片
            </h3>
            <ul
              style={{
                lineHeight: '2.4',
                fontSize: '14px',
                color: 'var(--text-sub)',
              }}
            >
              <li>
                <strong>路径顺序：</strong>统计推断力 → 概率建模力 → 数据感知力
                → 结果解释力
              </li>
              <li>
                <strong>台阶粒度：</strong>中粒度（5步/维度）
              </li>
              <li>
                <strong>资源类型：</strong>案例型
              </li>
              <li>
                <strong>拓展深度：</strong>1（适度推送AI发展目标）
              </li>
            </ul>
            <p
              style={{
                marginTop: '16px',
                fontSize: '13px',
                color: '#999',
                background: '#f8f9fa',
                padding: '10px',
                borderRadius: '6px',
              }}
            >
              说明：根据你前15个知识点的学习表现，系统已为你调整为此路径。
            </p>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>
              能力雷达图
            </h3>
            <p style={{ fontSize: '13px', color: '#999' }}>
              前15个知识点平均达成度
            </p>
            <ReactECharts
              option={radarOption}
              style={{ height: '240px', width: '100%' }}
            />
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>
              整体学习进步趋势图
            </h3>
            <ReactECharts
              option={trendOption}
              style={{ height: '240px', width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginTop: '40px' }}>
          {/* 左侧：完整版课程目录树 */}
          <div
            className="glass-card"
            style={{ width: '300px', flexShrink: 0, alignSelf: 'flex-start' }}
          >
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>课程目录</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* 第1章 - 样式可点击，实际不绑定点击事件 */}
              <div
                className="chapter-item"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <span>第1章 随机事件及其概率</span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  ▶
                </span>
              </div>

              {/* 第2章 - 实际可点击展开/折叠 */}
              <div
                className="chapter-item"
                onClick={() => toggleChapter('2')}
                style={{
                  color: 'var(--text-main)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <span>第2章 随机变量及其分布</span>
                <span
                  style={{
                    transform: expandedChapters['2']
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '12px',
                  }}
                >
                  ▶
                </span>
              </div>

              {/* 第2章子项 - 平滑展开 */}
              <div
                style={{
                  maxHeight: expandedChapters['2'] ? '500px' : '0',
                  opacity: expandedChapters['2'] ? 1 : 0,
                  overflow: 'hidden',
                  transition:
                    'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
                }}
              >
                <div className="chapter-sub-item">2.1 随机变量的概念</div>
                <div className="chapter-sub-item">
                  2.2 离散型随机变量及其分布
                </div>
                <div className="chapter-sub-item">2.3 0-1分布</div>
                <div className="chapter-sub-item">2.4 二项分布</div>
                <div className="chapter-sub-item">2.5 泊松分布</div>
                <div className="chapter-sub-item">
                  2.6 连续型随机变量及其分布函数
                </div>
                <div className="chapter-sub-item">2.7 均匀分布</div>
                <div className="chapter-sub-item">2.8 指数分布</div>
                <div
                  className={`chapter-sub-item ${activeChapter === '16' ? 'chapter-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChapter('16');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  2.9 正态分布
                </div>
                <div className="chapter-sub-item">2.10 随机变量函数的分布</div>
              </div>

              {/* 第3章 - 样式可点击，实际不绑定点击事件 */}
              <div
                className="chapter-item"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <span>第3章 多维随机变量</span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  ▶
                </span>
              </div>

              {/* 第4章 - 样式可点击，实际不绑定点击事件 */}
              <div
                className="chapter-item"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <span>第4章 随机变量的数字特征</span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  ▶
                </span>
              </div>

              {/* 第5章 - 样式可点击，实际不绑定点击事件 */}
              <div
                className="chapter-item"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <span>第5章 大数定律与中心极限定理</span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  ▶
                </span>
              </div>
            </div>
          </div>

          {/* 右侧：动态控制面板 */}
          {activeChapter === '16' ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                animation: 'fadeIn 0.3s',
              }}
            >
              <div
                className="glass-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '20px',
                      color: 'var(--primary)',
                      marginBottom: '8px',
                    }}
                  >
                    知识点16：正态分布
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      gap: '24px',
                      fontSize: '14px',
                      color: 'var(--text-sub)',
                    }}
                  >
                    <span>当前状态：课前预习</span>
                    <span>进度：已完成 15/30</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-sub)' }}>
                    AI预测本次达成度
                  </p>
                  <p
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#00d084',
                    }}
                  >
                    88%
                  </p>
                </div>
              </div>

              <div className="glass-card">
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>
                  课前建议提示
                </h3>
                <ul
                  style={{
                    paddingLeft: '20px',
                    listStyleType: 'disc',
                    color: 'var(--text-sub)',
                    lineHeight: '1.8',
                  }}
                >
                  <li>
                    即将学习正态分布，建议重点关注 3σ原则在异常检测中的应用。
                  </li>
                  <li>
                    回顾巩固：二项分布与泊松分布的关系，建议复习第11-12知识点。
                  </li>
                  <li>
                    你对AI兴趣中等，系统已推荐拓展案例《朴素贝叶斯分类器中的应用》。
                  </li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '12px 32px', fontSize: '16px' }}
                    onClick={() => setShowLearnMenu(!showLearnMenu)}
                  >
                    开始学习 ▼
                  </button>
                  {showLearnMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50px',
                        left: 0,
                        background: 'white',
                        boxShadow: 'var(--shadow-md)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        width: '100%',
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                        }}
                        onClick={() => navigate('/chat/pre')}
                      >
                        1. 课前预习
                      </div>
                      <div
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                        }}
                        onClick={() => navigate('/chat/in')}
                      >
                        2. 课中学习
                      </div>
                      <div
                        style={{ padding: '12px 16px', cursor: 'pointer' }}
                        onClick={() => navigate('/chat/post')}
                      >
                        3. 课后拓展
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="btn-outline"
                  style={{ padding: '12px 32px', fontSize: '16px' }}
                  disabled={!canViewReport}
                  onClick={() => setIsReportOpen(true)}
                >
                  {canViewReport ? '📊 查看报告' : '🔒 报告未解锁'}
                </button>
              </div>
            </div>
          ) : (
            // 默认展示的空占位状态
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafbfc',
                borderRadius: '16px',
                border: '1px dashed #dce4ef',
                animation: 'fadeIn 0.3s',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
              <h3
                style={{
                  color: 'var(--text-main)',
                  fontSize: '18px',
                  marginBottom: '8px',
                }}
              >
                欢迎来到学习主页
              </h3>
              <p style={{ color: '#999', fontSize: '14px' }}>
                请在左侧目录树中点击章节以展开本章学习内容与报告。
              </p>
            </div>
          )}
        </div>
      </main>
      {isReportOpen && (
        <CourseReportModal onClose={() => setIsReportOpen(false)} />
      )}{' '}
    </div>
  );
}
