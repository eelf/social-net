

class Status extends React.Component {
    function updateConnectionStatus() {
        document.getElementById('status').innerHTML = '<span style="color: ' + (connected ? 'green' : 'red') + ';">•</span>';
    }

}