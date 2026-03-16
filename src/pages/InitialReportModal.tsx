import React from 'react';

interface InitialReportModalProps {
  onClose: () => void;
}

export default function InitialReportModal({ onClose }: InitialReportModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', color: 'var(--text-main)' }}>初认识画像报告</h2>
          <button onClick={onClose} style={{ background: 'none', fontSize: '24px', color: '#999' }}>×</button>
        </div>
        
        <div style={{ animation: 'fadeIn 0.3s' }}>
          <p style={{ color: 'var(--text-sub)', marginBottom: '16px' }}>根据你的画像，系统为你生成了以下初始学习路径：</p>
          <table className="path-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>参数</th>
                <th style={{ width: '35%' }}>设定</th>
                <th style={{ width: '50%' }}>解释</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>路径顺序</td>
                <td>统计推断力 → 概率<br/>建模力 → 数据感知<br/>力 → 结果解释力</td>
                <td>你数学基础好，先从统计推断力入手，建立用数据说话的思维；再学习概率建模，然后用数据感知力加深理解，最后强化结果解释能力。</td>
              </tr>
              <tr>
                <td>台阶粒度</td>
                <td>中粒度（每个维度分解<br/>为 5 个学习台阶）</td>
                <td>你的基础不错，台阶不需要太细，但考虑到编程初学，也不宜过快，中粒度最适合你。</td>
              </tr>
              <tr>
                <td>资源类型</td>
                <td>案例型</td>
                <td>你偏好从案例入手，系统将优先推送真实案例和故事，帮助你理解抽象概念。</td>
              </tr>
              <tr>
                <td>拓展深度</td>
                <td>1（适度推送 AI 相关<br/>发展目标）</td>
                <td>根据你的 AI 兴趣，系统会适度推送一些 AI 应用案例，如朴素贝叶斯分类器中的概率基础，但不会过多深入。</td>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: 'center', marginTop: '16px', color: '#999', fontSize: '13px' }}>
            <p>这个路径不是一成不变的，它会在你的学习过程中，根据你的表现动态优化调整。</p>
          </div>
        </div>
      </div>
    </div>
  );
}