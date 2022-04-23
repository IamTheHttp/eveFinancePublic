import {Page} from "../../components/Page";
import * as React from "react";
import {Row} from "../../components/Row";
import {Panel} from "../../components/Panel";
import {useEffect, useState} from "react";
import Table from "../../components/Table/Table";
import postData from "../../utils/postData";
import {debounce} from "../../utils/debounce";





function LogsView() {
  const [fetchAllStatuses, setFetchAllStatuses] = useState(false);
  const [messageFilter, setMessageFilter] = useState('');
  const [logLines, setLogLines] = useState([]);
  const [selectedLogFile, setSelectedLogFile] = useState('');
  const [logFiles, setLogFiles] = useState([]);

  const myFn = debounce((value:string) => {
    setMessageFilter(value);
  }, 500);

  useEffect(() => {
    (async () => {
      const logLinesRequest = await postData<{ logLines: string[], logFiles: string[] }>('admin/logs', {
        logFilePath: selectedLogFile,
        messageFilter,
        statuses: fetchAllStatuses ? [] : ['error', 'raise']
      });

      setSelectedLogFile(selectedLogFile || logLinesRequest.data.logFiles[0]);

      setLogLines(logLinesRequest.data.logLines.reverse().map((r) => JSON.parse(r)));
      setLogFiles(logLinesRequest.data.logFiles);
    })();
  }, [selectedLogFile, fetchAllStatuses, messageFilter])

  return (
    <Page title={`Logs`}>

      <Row>
        <Panel columns={12}>
          <div>
            <input type='text' placeholder='message filter' onChange={(e) => {
              myFn(e.target.value);
            }}/>
          </div>
          <div>
            <label>Fetch all statuses:</label>
            <input type='checkbox' onChange={(e) => {
              setFetchAllStatuses(e.target.checked);
            }} />
          </div>
          <div>
            <select onChange={(e) => {
              setSelectedLogFile(e.target.value);
            }}>
              {logFiles.map((file) => {
                return <option key={file} value={file}>{file}</option>;
              })}
            </select>
          </div>

          <div>
            <Table
              hideSummary={true}
              data={logLines}
              columns={['time', 'topic', 'message']}/>
          </div>
        </Panel>
      </Row>
    </Page>
  )
}


export {LogsView}