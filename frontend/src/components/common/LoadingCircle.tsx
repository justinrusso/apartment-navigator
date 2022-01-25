import styled, { keyframes } from "styled-components";

const loadingRingKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingCircleRoot = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  height: 100%;
  justify-content: center;
`;

const LoadingCircleInner = styled.div`
  width: 64px;
  height: 64px;
  border: 8px solid ${(props) => props.theme.palette.text.primary};
  border-radius: 50%;
  animation: ${loadingRingKeyframes} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${(props) => props.theme.palette.text.primary} transparent
    transparent transparent;

  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

const LoadingCircle = () => {
  return (
    <LoadingCircleRoot>
      <LoadingCircleInner>
        <div></div>
        <div></div>
        <div></div>
      </LoadingCircleInner>
    </LoadingCircleRoot>
  );
};

export default LoadingCircle;
