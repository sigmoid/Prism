import LinkButton from './LinkButton';

const Camp = (props) => {
    const {fireLevel, setCurrentScreen} = props;

    return (
        <div>
            <label>fire:</label>
            <label>{fireLevel}</label>
            <LinkButton onClick={() => {setCurrentScreen('venture')}}>venture out</LinkButton>
        </div>);
}

export default Camp;