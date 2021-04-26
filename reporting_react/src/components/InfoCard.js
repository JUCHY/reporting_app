import Card from 'react-bootstrap/Card';


function InfoCard(props){
    return (<Card className="infocard">
        <Card.Body>
            <div className="text-left">
                <div>
                    <icon></icon>
                </div>
                <div className="center-text">
                    {props.name}
                </div>

            </div>
            <div className="text-right">
                <div>
                    Growth: {props.growth || 0}%
                </div>
                <div>
                    Current Year:  {props.money && '$' }{props.curr || 0} 
                </div>
                {props.prev && <div>
                    Previous Year: {props.money && '$'}{props.prev || 0}
                    </div>}
                <div>
                    All Transactions: {props.money && '$'}{props.total}
                </div>
            </div>
        </Card.Body>
    </Card>)
}

export default InfoCard;