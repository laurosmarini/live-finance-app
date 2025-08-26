import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gradients.background};
  position: relative;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '💎';
    margin-right: ${({ theme }) => theme.space[2]};
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  ${({ $isActive }) => $isActive && `
    color: white;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  `}
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
  
  .name {
    color: white;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.5);
    transform: translateY(-1px);
  }
`;

const Main = styled.main`
  /* No padding here since dashboard handles its own layout */
`;

function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const getInitials = (firstName, lastName, email) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/budgets', label: 'Budgets' },
    { path: '/crypto', label: 'Crypto' }
  ];

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Brand>
            <Title>CryptoFinance</Title>
          </Brand>
          
          <Navigation>
            {navItems.map(item => (
              <NavLink 
                key={item.path}
                to={item.path}
                $isActive={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </Navigation>
          
          <UserSection>
            <UserInfo>
              <div className="avatar">
                {getInitials(user?.firstName, user?.lastName, user?.email)}
              </div>
              <div className="name">
                {user?.firstName || user?.email}
              </div>
            </UserInfo>
            
            <LogoutButton onClick={logout}>
              Logout
            </LogoutButton>
          </UserSection>
        </HeaderContent>
      </Header>
      
      <Main>
        {children}
      </Main>
    </Container>
  );
}

export default Layout;
