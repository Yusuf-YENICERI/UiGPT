









import { useRef } from 'react';
import { Text, Group, Button, rem, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import classes from './dropzone.module.css';
import axios from 'axios';
import {isEmptyObjectLocDb} from '../common';
import db from '@yusuf-yeniceri/easy-storage'


export function DropzoneButton({setLoading, setHtmlCode, setFileReady}:{setLoading:(param: boolean)=>void, setHtmlCode:(param:string|undefined)=>void, setFileReady:(param: boolean)=>void}) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  
  async function encodeImage(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event:unknown) => {
        const base64String = event.target.result;
        resolve(base64String.split(',')[1]); // Extracting the base64 part
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      // Reading the contents of the image file as a data URL
      reader.readAsDataURL(file);
    });
  }


  const handleFileSelect = async (event:unknown) => {
    const file = event.target.files[0];

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const clientResponse = confirm('Are you sure you want to upload this image?');
      if (clientResponse){
        try {
            if(isEmptyObjectLocDb(db.ref(`uigpt/apiKey`).get()) == true){
              alert('Please enter your api key first')
              return
            }
            if(db.ref(`uigpt/apiKey`).get().value.length < 20){
                alert('Please enter valid api key')
                return
            }
            if(isEmptyObjectLocDb(db.ref(`uigpt/imageQuality`).get()) == true){
                db.ref('uigpt/imageQuality').set({value: true})
            }
            setLoading(true);
            const base64Image = await encodeImage(file);
            const response = await getOpenAIResponse(base64Image);
            const endResult = extractTextBetweenBackticks(response);
            console.log(response)
            console.log(endResult);
            const htmlCode = endResult
            setHtmlCode(htmlCode)
            setFileReady(true)
            setLoading(false);
            alert('If the page is blank or not properly generated, try to fix cdn script links in the code')
        } catch (error) {
            alert('An error occured: ' + error);
        }
        
      }
    } else {
      console.error('Invalid file type. Please select a JPG or PNG file.');
    }
  };

  function extractTextBetweenBackticks(htmlCode: string): string {
    const matches:string[]|null = htmlCode.match(/```html(.*?)```|```(.*?)```/gs);
    //console.log(matches[0])

    const lines = matches[0].split('\n');
  
    // Check if there are at least two lines
    if (lines.length < 3) {
      return ''; // If there are less than two lines, return an empty string
    }
  
    // Remove the first and last lines
    lines.shift();
    lines.pop();
  
    // Join the remaining lines back into a string
    const modifiedString = lines.join('\n');

    return modifiedString
  }
  

  const getOpenAIResponse = async (base64Image: unknown) => {
    const api_key = db.ref('uigpt/apiKey/value').get() // Replace with your OpenAI API key
    const framework = db.ref('uigpt/language/value').get()
    const imageQuality = db.ref('uigpt/imageQuality/value').get()
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`
    };

    const payload = {
      'model': 'gpt-4-vision-preview',
      'messages': [
        {
          'role': 'user',
          'content': [
            {
              'type': 'text',
              'text': `You are an assistant designed to help produce html code based on the given wireframe or image. 
              Produce a great html code similar to what you see. Output should be a single page and if you need to for example use react, use script links from cdns, don't generate more than one page.
       Now, use ${framework} when coding.`
            },
            {
              'type': 'image_url',
              'image_url': {
                'url': `data:image/jpeg;base64,${base64Image}`,
                'detail': imageQuality ? 'low' : 'auto'
              }
            }
          ]
        }
      ],
      'max_tokens': 1000
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
    return response.data.choices[0].message.content;
  };


  return (
    <div className={classes.wrapper}>
      <Dropzone
        useFsAccessApi={false}
        openRef={openRef}
        onChange={handleFileSelect}
        onDrop={() => {}}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.jpeg, MIME_TYPES.png]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload
                style={{ width: rem(50), height: rem(50) }}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(50), height: rem(50) }}
                color={theme.colors.red[6]}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload an image</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop the file here to upload. Do not forget, file should be an image.
          </Text>
        </div>
      </Dropzone>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
        Select file
      </Button>
    </div>
  );
}