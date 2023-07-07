import styled from 'styled-components';
import bgImg from '../../assets/bg.png'

export const StyledTetrisWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: red;
    overflow: hidden;
    background: url(${bgImg}) #000;
    background-size: cover;
    
`

export const StyledTetris = styled.div`
    display: flex;
    justify-content: center;
    margin: auto;
    max-width: 600px;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
        align-items: center;
    }
`