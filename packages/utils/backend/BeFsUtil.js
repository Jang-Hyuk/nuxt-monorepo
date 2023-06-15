import fs from 'node:fs'
import path from 'node:path'

export default class BeFsUtil {
  static bindWatchHMR() {
    const beSrcPath = path.resolve(process.cwd(), 'Backend')
    const feSrcPath = path.resolve(process.cwd(), 'Frontend');

    [['middleware'], ['routes'], ['models'], ['services'], ['common']].forEach(dirName =>
      BeFsUtil.requireFolder(beSrcPath, dirName),
    );

    [['_global']].forEach(dirName =>
      BeFsUtil.requireFolder(feSrcPath, dirName),
    )
  }

  /**
   * @param {string} dirName Folder 경로
   * @returns {string[]} 폴더 이름
   */
  static getDirectories(dirName) {
    return fs
      .readdirSync(dirName)
      .filter(file => fs.lstatSync(path.join(dirName, file)).isDirectory())
  }

  /**
   * 지정된 경로안에 존재하는 파일 목록 추출
   * @param {string} dirPath Folder 경로
   * @param {string[]=} extList 가져올 확장자 목록
   * @returns {string[]} 폴더 이름
   */
  static getFiles(dirPath, extList = []) {
    return fs
      .readdirSync(dirPath)
      .filter(file => fs.lstatSync(path.join(dirPath, file)).isFile())
      .filter((fileName) => {
        return extList.length ? extList.includes(fileName.split('.').pop()) : true
      })
  }

  /**
   * 지정 폴더를 기준으로 app.use 처리. 단 index는 '/'
   * @param {string} rootPath 실 디렉토리 앞에 붙을 경로
   * @param {string[]} dirPath 실 디렉토리
   * @param {number} [omitDepth = 1] 제외하고자 하는 dirPath 깊이
   */
  static requireFolder(rootPath, dirPath, omitDepth = 1) {
    const dynamicDirPath = path.resolve(rootPath, ...dirPath)
    // 디렉토리 목록 추출 (테스트 폴더 제외)
    const directoryList = BeFsUtil.getDirectories(dynamicDirPath).filter(
      dirPath => dirPath.includes('test') === false,
    )
    // 파일 명 추출
    const fileList = BeFsUtil.getFiles(dynamicDirPath, ['js'])

    // 파일 명 순회
    fileList.forEach((file) => {
      // 파일 이름
      const fileName = file.slice(0, file.lastIndexOf('.'))
      // 파일 경로
      const filePath = path.join(rootPath, ...dirPath, fileName)

      // 동적 라우팅
      require(filePath)
    })
    // 하부 폴더 목록을 기준으로 재귀
    directoryList.forEach((dirName) => {
      return BeFsUtil.requireFolder(rootPath, dirPath.concat(dirName), omitDepth)
    })
  }
}
