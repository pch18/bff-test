import { Alert, Tooltip } from '@arco-design/web-react';
import React, { useState, useRef, useEffect, CSSProperties, useMemo } from 'react';
import styled from 'styled-components';

type OverflowTooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 附加在tooltip上的style */
  tooltipStyle?: CSSProperties;
  /** 最大行数,默认1行 */
  lineClamp?: number;
};

/**
 * 传入文本,超框的话,用tooltip展示,
 * */
export const OverflowTooltip: React.FC<OverflowTooltipProps> = props => {
  const {
    className,
    style,
    tooltipStyle = {},
    children,
    lineClamp = 1,
    ...divProps
  } = props;
  const childRef = useRef<HTMLDivElement>(null);

  // children 变化后, 重新判断是否超框
  const needTooltip = useMemo(() =>
    childRef.current
      ? childRef.current.clientWidth < childRef.current.scrollWidth ||
      childRef.current.clientHeight < childRef.current.scrollHeight
      : false
    , [children]);

  return (
    <WrapperTooltip
      style={{ whiteSpace: 'pre-wrap', ...tooltipStyle }}
      triggerProps={{ autoFitPosition: true }}
      content={children}
      disabled={!needTooltip}>
      <WrapperMainDiv
        {...divProps}
        style={style}
        className={className}
        lineClamp={lineClamp}
        ref={childRef}>
        {children}
      </WrapperMainDiv>
    </WrapperTooltip>
  );
};

const WrapperMainDiv = styled.div<{ lineClamp: number }>`
  overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: ${p => p.lineClamp};
          display: -webkit-box;
          -webkit-box-orient: vertical;
`

const WrapperTooltip = styled(Tooltip)`
   .arco-tooltip-content-top,
        .arco-tooltip-content-inner {
          width: fit-content;
    }
`