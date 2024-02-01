import { useRef, useState } from 'react'
import './App.css'
import { DropzoneButton } from './Dropzone/dropzone'
import { FloatingLabelInput } from './Input/input'
import { Box, Button, Checkbox, Divider, Group, Image, LoadingOverlay, Text, Title } from '@mantine/core'
import { IconBrandGit, IconBrandGithub, IconBrandGithubCopilot } from '@tabler/icons-react'
import db from '@yusuf-yeniceri/easy-storage'


function isMobileWidth() {
  return window.innerWidth <= 767; // You can adjust the threshold as needed
}

function App() {

  const [isMobile, setIsMobile] = useState(isMobileWidth());
  const [fileReady, setFileReady] = useState(false);
  const [htmlCode, setHtmlCode] = useState("")
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("")

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "lg", blur: 5 }} />
        <div className='dropzonePlace'>    
      
        <div style={{display: 'flex', marginBottom: '0px'}}>
          <h1 style={{color: '#0fa0ee'}}>Ui</h1>
          <h1>GPT</h1>
        </div>
        <div style={{width: '150px'}}>
          <Image radius="md" src="/icon.jpg"/>
        </div>
        <div>
          <Text align="center" size="30px" mt="20px" color="#393939">Convert an <b>image</b>/<b>wireframe</b> to code in seconds!</Text>
        </div>
        <div >
          {fileReady && <Text align="center" color="black" size="30px" mt="30px" 
            style={{backgroundColor: '#5ffa88', padding: '20px', border:'1px solid #5ffa88', borderRadius: '5px'}}
          >Your page is ready!</Text>}
          {fileReady ? <> <Button size='lg' mt="30px" onClick={()=>{
            const win = window.open("", "_blank", "");
            win.document.body.innerHTML = htmlCode
          }}>Check Generated Page</Button> <Button size='lg' ml="xl" mt="30px" 
          onClick={()=>{
            const win = window.open("", "_blank", "");
            win.document.body.innerText = htmlCode
          }}
          >Get Code</Button> </> : <DropzoneButton setLoading={setLoading} setHtmlCode={setHtmlCode} setFileReady={setFileReady}></DropzoneButton>}
        </div>
      </div>
      <div className='buttomPart'>
        <div  style={{display: 'flex', marginTop: '80px', marginLeft: isMobile ? '22px' : '', width: isMobile ? '100%' : '33%',}}>
          <Text mt="20px" mr="md">Openai api key:</Text><FloatingLabelInput path="apiKey" type={"password"} label="enter your key.." placeholder='' width="50px"></FloatingLabelInput>

        </div>
        <div style={{display: 'flex', flexDirection: 'column',width:  isMobile ? '100%' : '33%', marginTop: '60px'}}>
          <div  style={{display: 'flex', alignItems: 'flex-end', marginLeft: '20px'}}>
            <Text mr="sm">Code will be written in</Text>
            <FloatingLabelInput path='language' type={null} label="bootstrap" placeholder='' width="10px"></FloatingLabelInput>
            <Text ml="sm">framework</Text>
          </div>
          <Divider color='blue' orientation='vertical'  ml="lg" mt="15px" ></Divider>
          <div  style={{display: 'flex', alignItems: 'flex-end', marginLeft: '20px'}}>
            <Text mr="sm">Reduce picture quality(better to save money) to low</Text>
            <Checkbox defaultChecked mb="3px" onChange={(event)=>{
              if(event.currentTarget.checked)
                db.ref('uigpt/imageQuality').set({value: event.currentTarget.checked})
            }} ></Checkbox>
          </div>
        </div>
        <div onClick={()=>{
          window.location.href = "https://github.com/Yusuf-YENICERI"
        }} style={{width:  isMobile ? '100%' : '33%', display: 'flex', alignItems: 'center', justifyContent :'center', flexDirection: 'column',
      marginTop: isMobile ? '60px' : '50px'}}>
            <div style={{textAlign: 'center'}}>
              <Text>Made by</Text>
              <Text color="#0fa0ee" ml="3px" size="lg">Yusuf Yeniçeri®</Text>
            </div>
            <IconBrandGithub color='#0fa0ee' size={36} />
        </div>
      </div>
      </Box>

      
    </>
  )
}

export default App
