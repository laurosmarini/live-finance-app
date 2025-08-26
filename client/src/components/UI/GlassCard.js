import React from 'react';
import styled, { css } from 'styled-components';

const CardContainer = styled.div`
  background: ${({ theme }) => theme.glass.effects.card.background};
  backdrop-filter: ${({ theme }) => theme.glass.effects.card.backdropFilter};
  -webkit-backdrop-filter: ${({ theme }) => theme.glass.effects.card.backdropFilter};
  border: ${({ theme }) => theme.glass.effects.card.border};
  border-radius: ${({ theme }) => theme.glass.effects.card.borderRadius};
  box-shadow: ${({ theme }) => theme.glass.effects.card.boxShadow};
  padding: ${({ theme }) => theme.space[6]};
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  }

  ${({ gradient }) => gradient && css`
    background: ${gradient};
    color: white;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    & > * {
      position: relative;
      z-index: 1;
    }
  `}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: ${({ theme }) => theme.space[4]};
        `;
      case 'large':
        return css`
          padding: ${({ theme }) => theme.space[8]};
        `;
      default:
        return css`
          padding: ${({ theme }) => theme.space[6]};
        `;
    }
  }}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.glass.text};
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.glass.textSecondary};
  margin: 0;
  margin-top: ${({ theme }) => theme.space[1]};
`;

const CardBody = styled.div`
  flex: 1;
`;

const CardFooter = styled.div`
  margin-top: ${({ theme }) => theme.space[4]};
  padding-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ color }) => color || 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: white;
  margin-right: ${({ theme }) => theme.space[3]};
`;

const ValueDisplay = styled.div`
  font-size: ${({ size }) => {
    switch (size) {
      case 'small': return '1.25rem';
      case 'large': return '2.5rem';
      case 'xl': return '3rem';
      default: return '2rem';
    }
  }};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme, color }) => color || theme.glass.text};
  line-height: 1.2;
  margin: ${({ theme }) => theme.space[2]} 0;
`;

const ChangeIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ isPositive }) => isPositive ? '#22c55e' : '#ef4444'};
  
  &::before {
    content: '${({ isPositive }) => isPositive ? '↗' : '↘'}';
    margin-right: ${({ theme }) => theme.space[1]};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const LoadingPulse = styled.div`
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.1) 25%, 
    rgba(255, 255, 255, 0.3) 50%, 
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: ${({ theme }) => theme.radii.md};
  height: ${({ height }) => height || '20px'};
  width: ${({ width }) => width || '100%'};
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Main GlassCard component
const GlassCard = ({ 
  title, 
  subtitle, 
  icon, 
  iconColor,
  gradient,
  size = 'medium',
  children,
  className,
  ...props 
}) => {
  return (
    <CardContainer 
      gradient={gradient} 
      size={size} 
      className={`glass-card ${className}`}
      {...props}
    >
      {(title || icon) && (
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {icon && (
              <IconContainer color={iconColor}>
                {icon}
              </IconContainer>
            )}
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
            </div>
          </div>
        </CardHeader>
      )}
      <CardBody>
        {children}
      </CardBody>
    </CardContainer>
  );
};

// Export components
export default GlassCard;
export { 
  CardHeader, 
  CardTitle, 
  CardSubtitle, 
  CardBody, 
  CardFooter, 
  ValueDisplay, 
  ChangeIndicator, 
  LoadingPulse 
};
