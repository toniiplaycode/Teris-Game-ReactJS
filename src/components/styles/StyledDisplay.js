import styled from 'styled-components';

export const StyledDisplay = styled.div`
    border: 4px solid #333;
    padding: 14px 20px 14px 4px;
    margin-bottom: 10px;
    border-radius: 16px;
    color: ${props => (props.gameOver ? 'red' : '#666')};
    background: #000;

    @media (max-width: 768px) { 
        padding: 2px;
        margin-bottom: 0;
    }
`