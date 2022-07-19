import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { dnoState } from "../recoil/diary";
import { call, callGetComment } from "../service/ApiService";
import theme from "../styles/theme";
import CommentItem from "./CommentItem";
import { FaRegCommentDots } from "react-icons/fa";

function Comment() {
  const getDno = useRecoilValue(dnoState);
  const [comment, setComment] = useState({ contents: "", dno: "" });
  const [commentArray, setCommentArray] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const { contents } = comment;

  //댓글 작성 onChangeHandler
  const writecomment = e => {
    setComment({ contents: e.target.value, dno: getDno });
  };

  //댓글 작성 버튼 클릭 시
  const commentSubmit = useCallback(() => {
    if (contents === "") {
      alert("댓글을 입력해 주세요");
      return;
    }

    callAddComment(comment);
    setComment({ contents: "" });
  }, [comment, contents]);

  //POST
  //댓글 추가하기
  const callAddComment = comment => {
    try {
      call("/reply/add", "POST", comment);
    } catch (error) {
      console.log(error);
    }
  };

  //GET
  //댓글 가져오기
  useEffect(() => {
    callGetComment(getDno).then(response => setCommentArray(response.data));
  }, [getDno, commentSubmit]);

  //댓글 아이콘 클릭 시 댓글 보기/숨기기
  const isShowComment = () => {
    setIsShow(!isShow);
  };

  return (
    <Container>
      <IconWrapper>
        <FaRegCommentDots onClick={isShowComment} className='icon' />
        <b>{commentArray.length}</b>
      </IconWrapper>
      <hr />

      {isShow === true ? (
        <>
          {commentArray &&
            Object.values(commentArray).map(item => (
              <CommentItem comments={item} key={item.rno} />
            ))}

          <InputWrapper>
            <Textarea
              type='text'
              placeholder='댓글을 작성하세요'
              name='contents'
              onChange={writecomment}
              value={contents}
            />
            <Button onClick={commentSubmit}>등록</Button>
          </InputWrapper>
        </>
      ) : (
        ""
      )}
    </Container>
  );
}

const Container = styled.div`
  @media ${theme.device.desktop} {
    width: 60vw;
    margin: 4rem auto;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon {
    font-size: 1.3rem;
    text-align: left;
    display: block;
    padding: 1rem;

    @media ${theme.device.desktop} {
      font-size: 1.5rem;
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 2rem auto;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  flex-basis: 80%;
  font-size: 1rem;
  border-radius: 0.2rem 0 0 0.2rem;
  height: 3rem;

  @media ${theme.device.desktop} {
    height: 5rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem;
  flex-basis: 20%;
  /* background-color: #eeeeee; */
  background-color: white;
  font-weight: bold;
  border: 1px solid gray;
  border-radius: 0 0.2rem 0.2rem 0;
`;
export default Comment;